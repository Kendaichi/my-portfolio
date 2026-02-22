import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useMemo, MutableRefObject } from "react";
import {
  getScrambledCubies,
  SOLVE_MOVES,
  applyMove,
  getAxisIndex,
  getAxisVector,
  CubieData,
} from "@/lib/cubeState";

const CUBIE_SIZE = 0.88;
const STICKER_SIZE = 0.71;
const STICKER_OFFSET = CUBIE_SIZE / 2 + 0.003;

// Grayscale palette
// const STICKER_COLORS = {
//   right: "#B8B8B8",
//   left: "#5A5A5A",
//   top: "#D4D4D4",
//   bottom: "#3A3A3A",
//   front: "#F0F0F0",
//   back: "#787878",
// };

// Muted, desaturated colors (alternative)
const STICKER_COLORS = {
  right: "#6A3232", // slightly more muted red
  left: "#664428", // slightly more muted orange
  top: "#AEAAA8", // slightly darker gray
  bottom: "#665E28", // slightly more muted yellow
  front: "#283F5E", // slightly more muted blue
  back: "#28583A", // slightly more muted green
};

interface StickerDef {
  show: boolean;
  color: string;
  position: [number, number, number];
  rotation: [number, number, number];
}

function getCubieStickers(ix: number, iy: number, iz: number): StickerDef[] {
  return [
    {
      show: ix === 1,
      color: STICKER_COLORS.right,
      position: [STICKER_OFFSET, 0, 0],
      rotation: [0, Math.PI / 2, 0],
    },
    {
      show: ix === -1,
      color: STICKER_COLORS.left,
      position: [-STICKER_OFFSET, 0, 0],
      rotation: [0, -Math.PI / 2, 0],
    },
    {
      show: iy === 1,
      color: STICKER_COLORS.top,
      position: [0, STICKER_OFFSET, 0],
      rotation: [-Math.PI / 2, 0, 0],
    },
    {
      show: iy === -1,
      color: STICKER_COLORS.bottom,
      position: [0, -STICKER_OFFSET, 0],
      rotation: [Math.PI / 2, 0, 0],
    },
    {
      show: iz === 1,
      color: STICKER_COLORS.front,
      position: [0, 0, STICKER_OFFSET],
      rotation: [0, 0, 0],
    },
    {
      show: iz === -1,
      color: STICKER_COLORS.back,
      position: [0, 0, -STICKER_OFFSET],
      rotation: [0, Math.PI, 0],
    },
  ];
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

interface CubeInnerProps {
  scrollProgress: MutableRefObject<number>;
  mouseRef: MutableRefObject<{ x: number; y: number }>;
}

function CubeInner({ scrollProgress, mouseRef }: CubeInnerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const cubieRefs = useRef<(THREE.Object3D | null)[]>([]);

  const { scrambledCubies, initialPositions, bodyMat, stickerMatByColor } =
    useMemo(() => {
      const cubies = getScrambledCubies();

      const initPos: [number, number, number][] = [];
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          for (let z = -1; z <= 1; z++) {
            initPos.push([x, y, z]);
          }
        }
      }

      const body = new THREE.MeshStandardMaterial({
        color: "#1A1A1A",
        roughness: 0.85,
        metalness: 0.05,
      });

      const stickerMats: Record<string, THREE.MeshStandardMaterial> = {};
      for (const color of Object.values(STICKER_COLORS)) {
        stickerMats[color] = new THREE.MeshStandardMaterial({
          color,
          roughness: 0.4,
          metalness: 0.05,
        });
      }

      return {
        scrambledCubies: cubies,
        initialPositions: initPos,
        bodyMat: body,
        stickerMatByColor: stickerMats,
      };
    }, []);

  const stateRef = useRef<{
    cubies: CubieData[];
    currentMoveIndex: number;
  }>({
    cubies: scrambledCubies.map((c) => ({
      ...c,
      position: c.position.clone(),
      quaternion: c.quaternion.clone(),
    })),
    currentMoveIndex: 0,
  });

  const timeRef = useRef(0);

  useFrame((_state, delta) => {
    timeRef.current += delta;

    if (groupRef.current) {
      const targetY =
        -Math.PI / 4 +
        mouseRef.current.x * 0.3 +
        Math.sin(timeRef.current * 0.25) * 0.04;
      const targetX =
        Math.PI / 6 -
        mouseRef.current.y * 0.2 +
        Math.sin(timeRef.current * 0.18) * 0.025;
      groupRef.current.rotation.y +=
        (targetY - groupRef.current.rotation.y) * 0.04;
      groupRef.current.rotation.x +=
        (targetX - groupRef.current.rotation.x) * 0.04;
    }

    const progress = Math.max(0, Math.min(1, scrollProgress.current));
    const totalMoves = SOLVE_MOVES.length;
    const moveProgress = progress * totalMoves;
    const targetMoveIndex = Math.min(Math.floor(moveProgress), totalMoves);
    const fraction =
      targetMoveIndex < totalMoves ? moveProgress - targetMoveIndex : 0;

    // Forward
    while (stateRef.current.currentMoveIndex < targetMoveIndex) {
      const move = SOLVE_MOVES[stateRef.current.currentMoveIndex];
      stateRef.current.cubies = applyMove(stateRef.current.cubies, move);
      stateRef.current.currentMoveIndex++;
    }

    // Backward
    while (stateRef.current.currentMoveIndex > targetMoveIndex) {
      stateRef.current.currentMoveIndex--;
      const move = SOLVE_MOVES[stateRef.current.currentMoveIndex];
      stateRef.current.cubies = applyMove(stateRef.current.cubies, {
        ...move,
        angle: -move.angle,
      });
    }

    const currentMove =
      targetMoveIndex < totalMoves ? SOLVE_MOVES[targetMoveIndex] : null;
    const easedFraction = easeInOutCubic(fraction);

    stateRef.current.cubies.forEach((cubie, i) => {
      const ref = cubieRefs.current[i];
      if (!ref) return;

      let pos = cubie.position;
      let quat = cubie.quaternion;

      if (currentMove) {
        const axisIdx = getAxisIndex(currentMove.axis);
        if (
          Math.round(cubie.position.getComponent(axisIdx)) === currentMove.layer
        ) {
          const axisVec = getAxisVector(currentMove.axis);
          const partialAngle = currentMove.angle * easedFraction;

          pos = cubie.position.clone().applyAxisAngle(axisVec, partialAngle);
          const partialQ = new THREE.Quaternion().setFromAxisAngle(
            axisVec,
            partialAngle
          );
          quat = partialQ.multiply(cubie.quaternion.clone());
        }
      }

      ref.position.copy(pos);
      ref.quaternion.copy(quat);
    });
  });

  return (
    <group ref={groupRef}>
      {scrambledCubies.map((_, i) => {
        const [ix, iy, iz] = initialPositions[i];
        const stickers = getCubieStickers(ix, iy, iz);
        return (
          <group
            key={i}
            ref={(el) => {
              cubieRefs.current[i] = el;
            }}
          >
            <RoundedBox
              args={[CUBIE_SIZE, CUBIE_SIZE, CUBIE_SIZE]}
              radius={0.08}
              smoothness={3}
              material={bodyMat}
              castShadow
              receiveShadow
            />
            {stickers
              .filter((s) => s.show)
              .map((sticker, j) => (
                <mesh
                  key={j}
                  position={sticker.position}
                  rotation={sticker.rotation}
                  material={stickerMatByColor[sticker.color]}
                >
                  <planeGeometry args={[STICKER_SIZE, STICKER_SIZE]} />
                </mesh>
              ))}
          </group>
        );
      })}
    </group>
  );
}

export default function CubeCanvas({
  scrollProgress,
  mouseRef,
}: {
  scrollProgress: MutableRefObject<number>;
  mouseRef: MutableRefObject<{ x: number; y: number }>;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.5], fov: 40 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[6, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
      />
      <directionalLight position={[-4, 3, -3]} intensity={0.4} />
      <directionalLight position={[0, -5, 3]} intensity={0.2} />
      <pointLight position={[0, 0, 6]} intensity={0.3} />
      <CubeInner scrollProgress={scrollProgress} mouseRef={mouseRef} />
    </Canvas>
  );
}
