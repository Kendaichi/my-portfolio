import { useEffect, useRef, MutableRefObject } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

type BlinkState = "open" | "closing" | "closed" | "opening";

interface Eye {
  openness: number;
  state: BlinkState;
  step: number;
  timer: number;
}

interface Robot {
  xPct: number;
  yPct: number;
  scale: number; // conceptual scale — drives depth/opacity
  blink: Eye;
  lookPhase: number;
  lookSpeed: number;
  currLookX: number;
  currLookY: number;
  r: number;
  g: number;
  b: number;
  flickerOpacity: number;
  flickerTimer: number;
  powerTimer: number;
  startupPhase: "dormant" | "flicker" | "rising";
  startupFlickerTimer: number;
  eyeScale: number;
  bodyScale: number;
  podiumRank: 1 | 2 | 3 | null;
  headRotation: number;
  headFlip: boolean;
  lookBias: number;
}

const PARTICLE_COUNT = 60;
const CONNECTION_DISTANCE = 120;
const CLOSE_FRAMES = 25;
const CLOSED_FRAMES = 15;
const OPEN_FRAMES = 38;

const GROUND_PCT = 0.9;
const PLATFORM_H_UNITS: Record<1 | 2 | 3, number> = { 1: 60, 2: 42, 3: 28 };
const PODIUM_ACCENT: Record<1 | 2 | 3, [number, number, number]> = {
  1: [212, 175, 55],
  2: [180, 188, 192],
  3: [180, 115, 60],
};

// [xPct, yPct, scale, podiumRank | null, headRotation, headFlip, lookBias]
// yPct is ignored for podium robots — position computed from GROUND_PCT
const FORMATION: [
  number,
  number,
  number,
  1 | 2 | 3 | null,
  number,
  boolean,
  number
][] = [
  // ── Far back row ─────────────────────────────────────────────
  [0.05, 0.11, 1.0, null, 0.06, false, 0.0],
  [0.13, 0.09, 1.1, null, -0.08, true, 0.0],
  [0.22, 0.08, 1.0, null, 0.04, false, 0.0],
  [0.31, 0.09, 1.2, null, -0.06, true, 0.0],
  [0.41, 0.08, 1.0, null, 0.07, false, 0.0],
  [0.51, 0.1, 1.1, null, -0.05, true, 0.0],
  [0.6, 0.09, 1.0, null, 0.09, false, 0.0],
  [0.69, 0.11, 1.2, null, -0.04, true, 0.0],
  [0.77, 0.13, 1.0, null, 0.06, false, 0.0],
  // ── Back row ─────────────────────────────────────────────────
  [0.08, 0.2, 1.4, null, 0.07, false, 0.0],
  [0.16, 0.18, 1.5, null, -0.09, true, 0.0],
  [0.25, 0.17, 1.4, null, 0.05, false, 0.0],
  [0.34, 0.16, 1.6, null, -0.06, true, 0.0],
  [0.44, 0.17, 1.4, null, 0.1, false, 0.0],
  [0.54, 0.19, 1.5, null, -0.07, true, 0.0],
  [0.63, 0.2, 1.4, null, 0.05, false, 0.0],
  [0.72, 0.22, 1.6, null, -0.08, true, 0.0],
  // ── Mid row ──────────────────────────────────────────────────
  [0.03, 0.31, 1.9, null, -0.08, true, 0.0],
  [0.11, 0.28, 2.1, null, 0.05, false, 0.0],
  [0.2, 0.26, 1.8, null, -0.11, false, 0.0],
  [0.3, 0.27, 2.0, null, 0.07, true, 0.0],
  [0.4, 0.29, 1.7, null, -0.04, false, 0.0],
  [0.5, 0.3, 1.9, null, 0.09, true, 0.0],
  [0.6, 0.31, 1.8, null, -0.06, false, 0.0],
  [0.7, 0.33, 2.0, null, 0.08, true, 0.0],
  [0.78, 0.35, 1.7, null, -0.05, false, 0.0],
  // ── Podium (3rd first, 1st last so it paints on top) ─────────
  [0.51, 0, 4.2, 3, 0.18, false, 0.88], // 3rd: right, looks right
  [0.21, 0, 5.0, 2, -0.18, true, -0.88], // 2nd: left, looks left
  [0.36, 0, 6.0, 1, -0.03, false, 0.0], // 1st: center, faces viewer
];

const EYE_COLORS: [number, number, number][] = [
  [220, 50, 50],
  [220, 50, 50],
  [220, 50, 50],
  [255, 130, 30],
  [55, 210, 160],
];

function randomBlinkDelay(extra = 0) {
  return Math.floor(Math.random() * 1800 + 1800 + extra);
}
function makeEye(offset = 0): Eye {
  return {
    openness: 1,
    state: "open",
    step: 0,
    timer: randomBlinkDelay(offset),
  };
}
function tickEye(eye: Eye) {
  if (eye.state === "open") {
    if (--eye.timer <= 0) {
      eye.state = "closing";
      eye.step = 0;
    }
  } else if (eye.state === "closing") {
    ++eye.step;
    const t = eye.step / CLOSE_FRAMES;
    eye.openness = 1 - t * t;
    if (eye.step >= CLOSE_FRAMES) {
      eye.openness = 0;
      eye.state = "closed";
      eye.step = 0;
    }
  } else if (eye.state === "closed") {
    if (++eye.step >= CLOSED_FRAMES) {
      eye.state = "opening";
      eye.step = 0;
    }
  } else {
    ++eye.step;
    const t = eye.step / OPEN_FRAMES;
    eye.openness = Math.sqrt(t);
    if (eye.step >= OPEN_FRAMES) {
      eye.openness = 1;
      eye.state = "open";
      eye.timer = randomBlinkDelay();
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PLATFORM
// effectiveScale = robot.scale * deviceScale — drives pixel dimensions
// robot.scale alone drives depth/opacity so depth looks correct at all sizes
// ─────────────────────────────────────────────────────────────────────────────
function drawPlatform(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  robot: Robot,
  effectiveScale: number
) {
  const { podiumRank, r, g, b, flickerOpacity, bodyScale } = robot;
  if (!podiumRank) return;

  const hw = 30 * effectiveScale;
  const hh = 24 * effectiveScale;
  const platformH = PLATFORM_H_UNITS[podiumRank] * effectiveScale;
  const platformW = hw * 2.7;
  const platTop = hh;

  const [ar, ag, ab] = PODIUM_ACCENT[podiumRank];
  const depth = Math.min(0.8, 0.12 + robot.scale * 0.16);
  const alpha = depth * bodyScale;

  ctx.save();
  ctx.translate(x, y);

  const bodyGrad = ctx.createLinearGradient(
    -platformW / 2,
    platTop,
    platformW / 2,
    platTop + platformH
  );
  bodyGrad.addColorStop(0, `rgba(22, 28, 36, ${0.95 * alpha})`);
  bodyGrad.addColorStop(0.5, `rgba(14, 18, 24, ${0.95 * alpha})`);
  bodyGrad.addColorStop(1, `rgba(8, 10, 14,  ${0.9 * alpha})`);
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.roundRect(-platformW / 2, platTop, platformW, platformH, [
    0,
    0,
    5 * effectiveScale,
    5 * effectiveScale,
  ]);
  ctx.fill();

  const accentH = 4 * effectiveScale;
  ctx.fillStyle = `rgba(${ar}, ${ag}, ${ab}, ${0.88 * alpha})`;
  ctx.fillRect(-platformW / 2, platTop, platformW, accentH);

  ctx.fillStyle = `rgba(255, 255, 255, ${0.3 * alpha})`;
  ctx.fillRect(-platformW / 2, platTop, platformW, 1 * effectiveScale);

  ctx.strokeStyle = `rgba(45, 58, 72, ${0.6 * alpha})`;
  ctx.lineWidth = 1 * effectiveScale;
  for (const sx of [
    -platformW / 2 + 2 * effectiveScale,
    platformW / 2 - 2 * effectiveScale,
  ]) {
    ctx.beginPath();
    ctx.moveTo(sx, platTop + accentH + 2 * effectiveScale);
    ctx.lineTo(sx, platTop + platformH - 3 * effectiveScale);
    ctx.stroke();
  }

  const faceGlow = ctx.createRadialGradient(
    0,
    platTop + platformH * 0.45,
    0,
    0,
    platTop + platformH * 0.45,
    platformW * 0.55
  );
  faceGlow.addColorStop(
    0,
    `rgba(${r}, ${g}, ${b}, ${0.12 * flickerOpacity * alpha})`
  );
  faceGlow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
  ctx.fillStyle = faceGlow;
  ctx.beginPath();
  ctx.roundRect(-platformW / 2, platTop, platformW, platformH, [
    0,
    0,
    5 * effectiveScale,
    5 * effectiveScale,
  ]);
  ctx.fill();

  ctx.restore();
}

// ─────────────────────────────────────────────────────────────────────────────
// ROBOT HEAD
// ─────────────────────────────────────────────────────────────────────────────
function drawRobot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  robot: Robot,
  effectiveScale: number
) {
  const {
    blink,
    eyeScale,
    bodyScale,
    r,
    g,
    b,
    flickerOpacity,
    headRotation,
    headFlip,
  } = robot;

  const lookX = robot.currLookX * (headFlip ? -1 : 1);
  const lookY = robot.currLookY;

  const depth = Math.min(0.8, 0.12 + robot.scale * 0.16);
  const headAlpha = depth * bodyScale;
  const bodyAlpha = headAlpha * 0.18;

  const hw = 30 * effectiveScale;
  const hh = 24 * effectiveScale;
  const eyeY = -hh * 0.1;

  const mLit = (a: number) => `rgba(18, 23, 30,   ${a * headAlpha})`;
  const mMid = (a: number) => `rgba(10, 13, 18,   ${a * headAlpha})`;
  const mDark = (a: number) => `rgba(4,   5,  8,   ${a * headAlpha})`;
  const mEdge = (a: number) => `rgba(28, 36, 46,   ${a * headAlpha})`;
  const mShin = (a: number) => `rgba(160, 190, 215, ${a * headAlpha})`;
  const bDark = (a: number) => `rgba(10, 12, 16, ${a * bodyAlpha})`;
  const bMid = (a: number) => `rgba(16, 20, 26, ${a * bodyAlpha})`;

  ctx.save();
  ctx.translate(x, y);
  if (headFlip) ctx.scale(-1, 1);
  if (headRotation !== 0) ctx.rotate(headRotation);

  // Body shadow — audience robots only
  if (!robot.podiumRank) {
    const shTop = hh + 6 * effectiveScale;
    const shBot = hh + 24 * effectiveScale;
    const chTop = shBot;
    const chH = hh * 2.4;
    const bodyBottom = chTop + chH;

    const bodyFade = ctx.createLinearGradient(0, shTop, 0, bodyBottom);
    bodyFade.addColorStop(0, bMid(1));
    bodyFade.addColorStop(0.4, bDark(1));
    bodyFade.addColorStop(1, `rgba(0,0,0,0)`);

    ctx.fillStyle = bDark(1);
    ctx.fillRect(-hw * 0.2, hh, hw * 0.4, 6 * effectiveScale);

    ctx.fillStyle = bodyFade;
    ctx.beginPath();
    ctx.moveTo(-hw * 1.55, shTop);
    ctx.lineTo(hw * 1.55, shTop);
    ctx.lineTo(hw * 1.12, shBot);
    ctx.lineTo(-hw * 1.12, shBot);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = bodyFade;
    ctx.beginPath();
    ctx.roundRect(-hw * 1.52, chTop, hw * 3.04, chH, [
      0,
      0,
      5 * effectiveScale,
      5 * effectiveScale,
    ]);
    ctx.fill();
  }

  // Helmet crest
  const crGrad = ctx.createLinearGradient(0, -hh - 13 * effectiveScale, 0, -hh);
  crGrad.addColorStop(0, mLit(0.85));
  crGrad.addColorStop(0.6, mMid(1));
  crGrad.addColorStop(1, mDark(1));
  ctx.fillStyle = crGrad;
  ctx.beginPath();
  ctx.moveTo(-hw * 0.5, -hh - 13 * effectiveScale);
  ctx.lineTo(hw * 0.5, -hh - 13 * effectiveScale);
  ctx.lineTo(hw * 0.92, -hh);
  ctx.lineTo(-hw * 0.92, -hh);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = mEdge(0.7);
  ctx.lineWidth = 1.0 * effectiveScale;
  ctx.stroke();

  // Head block
  const hdGrad = ctx.createLinearGradient(-hw * 0.5, -hh, hw * 0.5, hh);
  hdGrad.addColorStop(0, mLit(1));
  hdGrad.addColorStop(0.35, mMid(1));
  hdGrad.addColorStop(0.75, mDark(1));
  hdGrad.addColorStop(1, mDark(0.85));
  ctx.fillStyle = hdGrad;
  ctx.beginPath();
  ctx.roundRect(-hw, -hh, hw * 2, hh * 2, 2 * effectiveScale);
  ctx.fill();

  ctx.strokeStyle = mEdge(0.75);
  ctx.lineWidth = 1.8 * effectiveScale;
  ctx.beginPath();
  ctx.roundRect(-hw, -hh, hw * 2, hh * 2, 2 * effectiveScale);
  ctx.stroke();

  // Specular sheen
  const sheenGrad = ctx.createLinearGradient(0, -hh, 0, -hh * 0.2);
  sheenGrad.addColorStop(0, mShin(0.0));
  sheenGrad.addColorStop(0.25, mShin(0.38));
  sheenGrad.addColorStop(0.55, mShin(0.15));
  sheenGrad.addColorStop(1, mShin(0.0));
  ctx.fillStyle = sheenGrad;
  ctx.beginPath();
  ctx.roundRect(-hw * 0.96, -hh, hw * 1.92, hh * 0.8, [
    2 * effectiveScale,
    2 * effectiveScale,
    0,
    0,
  ]);
  ctx.fill();

  const glintGrad = ctx.createLinearGradient(-hw * 0.6, 0, hw * 0.6, 0);
  glintGrad.addColorStop(0, mShin(0.0));
  glintGrad.addColorStop(0.25, mShin(0.55));
  glintGrad.addColorStop(0.5, mShin(0.75));
  glintGrad.addColorStop(0.75, mShin(0.55));
  glintGrad.addColorStop(1, mShin(0.0));
  ctx.fillStyle = glintGrad;
  ctx.fillRect(
    -hw * 0.88,
    -hh + 1 * effectiveScale,
    hw * 1.76,
    2.5 * effectiveScale
  );

  // Eye spill
  const spill = ctx.createRadialGradient(0, eyeY, 0, 0, eyeY, hw * 1.6);
  spill.addColorStop(
    0,
    `rgba(${r}, ${g}, ${b}, ${0.32 * flickerOpacity * headAlpha})`
  );
  spill.addColorStop(
    0.55,
    `rgba(${r}, ${g}, ${b}, ${0.1 * flickerOpacity * headAlpha})`
  );
  spill.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
  ctx.fillStyle = spill;
  ctx.beginPath();
  ctx.roundRect(-hw, -hh, hw * 2, hh * 2, 2 * effectiveScale);
  ctx.fill();

  // Ear panels
  const earW = 7 * effectiveScale;
  const earTop = -hh * 0.65;
  const earH = hh * 1.45;

  const earGradL = ctx.createLinearGradient(-hw - earW, 0, -hw, 0);
  earGradL.addColorStop(0, mDark(1));
  earGradL.addColorStop(1, mMid(1));
  ctx.fillStyle = earGradL;
  ctx.beginPath();
  ctx.roundRect(-hw - earW, earTop, earW, earH, [
    3 * effectiveScale,
    0,
    0,
    3 * effectiveScale,
  ]);
  ctx.fill();

  const earGradR = ctx.createLinearGradient(hw, 0, hw + earW, 0);
  earGradR.addColorStop(0, mMid(1));
  earGradR.addColorStop(1, mDark(1));
  ctx.fillStyle = earGradR;
  ctx.beginPath();
  ctx.roundRect(hw, earTop, earW, earH, [
    0,
    3 * effectiveScale,
    3 * effectiveScale,
    0,
  ]);
  ctx.fill();

  // Visor brim
  ctx.fillStyle = mDark(1.0);
  ctx.beginPath();
  ctx.roundRect(
    -hw * 0.9,
    -hh * 0.33,
    hw * 1.8,
    5 * effectiveScale,
    2 * effectiveScale
  );
  ctx.fill();

  // Face panel lines
  ctx.strokeStyle = mDark(0.85);
  ctx.lineWidth = 1.2 * effectiveScale;
  ctx.beginPath();
  ctx.moveTo(-hw * 0.32, -hh * 0.88);
  ctx.lineTo(-hw * 0.32, hh * 0.8);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(hw * 0.32, -hh * 0.88);
  ctx.lineTo(hw * 0.32, hh * 0.8);
  ctx.stroke();

  // Jaw seam
  ctx.fillStyle = mDark(0.9);
  ctx.fillRect(-hw * 0.9, hh * 0.38, hw * 1.8, 2.5 * effectiveScale);

  // Chin plate
  const chinGrad = ctx.createLinearGradient(0, hh * 0.4, 0, hh);
  chinGrad.addColorStop(0, mMid(1));
  chinGrad.addColorStop(1, mDark(1));
  ctx.fillStyle = chinGrad;
  ctx.beginPath();
  ctx.roundRect(-hw * 0.78, hh * 0.42, hw * 1.56, hh * 0.68, [
    0,
    0,
    4 * effectiveScale,
    4 * effectiveScale,
  ]);
  ctx.fill();

  // Eyes
  const eyeR = 5.5 * effectiveScale;
  const eyeSpacing = 11 * effectiveScale;

  const drawEye = (ex: number, eye: Eye) => {
    const op = eye.openness * flickerOpacity * eyeScale;
    if (op <= 0.01) return;
    const radius = eyeR * eye.openness;

    ctx.save();
    ctx.translate(ex, eyeY);

    const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, eyeR * 5.5);
    halo.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${0.5 * op * headAlpha})`);
    halo.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${0.18 * op * headAlpha})`);
    halo.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(0, 0, eyeR * 5.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 1)`;
    ctx.shadowBlur = 20 * effectiveScale;
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.97 * op})`;
    ctx.beginPath();
    ctx.arc(lookX * 0.3, lookY * 0.3, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 10 * effectiveScale;
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.5 * op})`;
    ctx.beginPath();
    ctx.arc(lookX * 0.3, lookY * 0.3, radius * 1.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = `rgba(255, 235, 220, ${0.9 * op})`;
    ctx.beginPath();
    ctx.arc(
      lookX * 0.5 - radius * 0.15,
      lookY * 0.5 - radius * 0.22,
      radius * 0.3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.restore();
  };

  drawEye(-eyeSpacing, blink);
  drawEye(eyeSpacing, blink);

  ctx.restore();
}

// ─────────────────────────────────────────────────────────────────────────────
// Compute a global pixel-size multiplier from current viewport width.
// Robots keep their conceptual scale (depth/opacity), but shrink on narrow screens.
// ─────────────────────────────────────────────────────────────────────────────
function getDeviceScale(width: number): number {
  // 1440px → 1.0   |   768px → ~0.53   |   390px → ~0.27
  return Math.min(1.0, Math.max(0.25, width / 1440));
}

interface Props {
  scrollProgress: MutableRefObject<number>;
  mouseRef: MutableRefObject<{ x: number; y: number }>;
}

export default function RobotParticleBackground({
  scrollProgress,
  mouseRef,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: Particle[] = Array.from(
      { length: PARTICLE_COUNT },
      () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        size: Math.random() * 1.8 + 0.6,
        opacity: Math.random() * 0.45 + 0.15,
      })
    );

    const robots: Robot[] = FORMATION.map(
      ([xPct, yPct, scale, podiumRank, headRotation, headFlip, lookBias]) => {
        const [r, g, b] =
          EYE_COLORS[Math.floor(Math.random() * EYE_COLORS.length)];
        return {
          xPct,
          yPct,
          scale,
          blink: makeEye(Math.floor(Math.random() * 200)),
          lookPhase: Math.random() * Math.PI * 2,
          lookSpeed: 0.002 + Math.random() * 0.003,
          currLookX: 0,
          currLookY: 0,
          r,
          g,
          b,
          powerTimer: Math.floor(Math.random() * 1800),
          startupPhase: "dormant" as const,
          startupFlickerTimer: Math.floor(Math.random() * 80 + 60),
          eyeScale: 0,
          bodyScale: 0,
          flickerOpacity: 1,
          flickerTimer: Math.floor(Math.random() * 500 + 300),
          podiumRank,
          headRotation,
          headFlip,
          lookBias,
        };
      }
    );

    let rafId: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const deviceScale = getDeviceScale(width);
      const mouseCanvasX = (mouseRef.current.x + 0.5) * width;
      const mouseCanvasY = (mouseRef.current.y + 0.5) * height;

      // On mobile, shift the whole formation right so it centers around x=0.50.
      // The podium cluster sits around xPct=0.36 by design (left-biased for desktop
      // where the cube takes the right half). On mobile the cube is centered, so
      // the robots should be too.
      const xOffset = width < 640 ? 0.14 : 0;

      // On narrow screens skip the far-back tiny robots (scale < 1.3)
      // to reduce clutter and improve performance on mobile
      const minScale = width < 640 ? 1.3 : 0;

      for (const robot of robots) {
        if (robot.scale < minScale && !robot.podiumRank) continue;

        // Power-on sequence
        if (robot.startupPhase === "dormant") {
          if (--robot.powerTimer <= 0) robot.startupPhase = "flicker";
        } else if (robot.startupPhase === "flicker") {
          robot.startupFlickerTimer--;
          robot.eyeScale = Math.random() < 0.3 ? Math.random() * 0.45 : 0;
          if (robot.startupFlickerTimer <= 0) {
            robot.startupPhase = "rising";
            robot.eyeScale = 0;
          }
        } else {
          if (robot.eyeScale < 1.0)
            robot.eyeScale = Math.min(1.0, robot.eyeScale + 0.07);
          if (robot.eyeScale >= 0.4 && robot.bodyScale < 1.0)
            robot.bodyScale = Math.min(1.0, robot.bodyScale + 0.01);
        }

        if (robot.eyeScale <= 0 && robot.startupPhase !== "flicker") continue;

        tickEye(robot.blink);
        robot.lookPhase += robot.lookSpeed;

        robot.flickerTimer--;
        if (robot.flickerTimer <= 0) {
          robot.flickerOpacity = Math.random() * 0.28 + 0.72;
          robot.flickerTimer =
            Math.random() < 0.12
              ? Math.floor(Math.random() * 3 + 1)
              : Math.floor(Math.random() * 500 + 300);
        } else {
          robot.flickerOpacity += (1 - robot.flickerOpacity) * 0.1;
        }

        // Effective pixel scale = conceptual scale × device multiplier
        const effectiveScale = robot.scale * deviceScale;
        const hh = 24 * effectiveScale;
        const hw = 30 * effectiveScale;
        const robotX = (robot.xPct + xOffset) * width;
        const robotY =
          robot.podiumRank !== null
            ? height * GROUND_PCT -
              PLATFORM_H_UNITS[robot.podiumRank] * effectiveScale -
              hh
            : robot.yPct * height;

        // Look direction
        const eyeAbsY = robotY - hh * 0.1;
        const dx = mouseCanvasX - robotX;
        const dy = mouseCanvasY - eyeAbsY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const hoverZone = hw * 5;

        const maxDriftX = 2.8 * effectiveScale;
        const maxDriftY = 0.8 * effectiveScale;

        let targetLookX: number;
        let targetLookY: number;

        if (dist < hoverZone) {
          const t = Math.min(1, dist / hoverZone);
          const pull = 1 - t;
          targetLookX = Math.max(
            -maxDriftX,
            Math.min(maxDriftX, (dx / hoverZone) * maxDriftX * 3 * pull)
          );
          targetLookY = Math.max(
            -maxDriftY,
            Math.min(maxDriftY, (dy / hoverZone) * maxDriftY * 3 * pull)
          );
        } else {
          const drift = maxDriftX * (1 - Math.abs(robot.lookBias) * 0.65);
          targetLookX =
            robot.lookBias * maxDriftX + Math.sin(robot.lookPhase) * drift;
          targetLookX = Math.max(-maxDriftX, Math.min(maxDriftX, targetLookX));
          targetLookY = Math.sin(robot.lookPhase * 0.6) * maxDriftY;
        }

        robot.currLookX += (targetLookX - robot.currLookX) * 0.06;
        robot.currLookY += (targetLookY - robot.currLookY) * 0.06;

        if (robot.eyeScale > 0 || robot.startupPhase === "flicker") {
          drawPlatform(ctx, robotX, robotY, robot, effectiveScale);
          drawRobot(ctx, robotX, robotY, robot, effectiveScale);
        }
      }

      // Particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DISTANCE) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255,255,255,${
              0.14 * (1 - dist / CONNECTION_DISTANCE)
            })`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
