import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useRef, useMemo, MutableRefObject } from 'react';
import {
  getScrambledCubies,
  SOLVE_MOVES,
  applyMove,
  getAxisIndex,
  getAxisVector,
  CubieData,
} from '@/lib/cubeState';

const CUBIE_SIZE = 0.88;

function getCubieFaceColors(ix: number, iy: number, iz: number): string[] {
  const dark = '#161616';
  return [
    ix === 1 ? '#B8B8B8' : dark,
    ix === -1 ? '#5A5A5A' : dark,
    iy === 1 ? '#D4D4D4' : dark,
    iy === -1 ? '#3A3A3A' : dark,
    iz === 1 ? '#F0F0F0' : dark,
    iz === -1 ? '#787878' : dark,
  ];
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

interface CubeInnerProps {
  scrollProgress: MutableRefObject<number>;
}

function CubeInner({ scrollProgress }: CubeInnerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const cubieRefs = useRef<(THREE.Mesh | null)[]>([]);

  const { scrambledCubies, materials, initialPositions } = useMemo(() => {
    const cubies = getScrambledCubies();

    const mats: THREE.MeshStandardMaterial[][] = [];
    const initPos: [number, number, number][] = [];
    let idx = 0;
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const colors = getCubieFaceColors(x, y, z);
          mats.push(
            colors.map(
              c =>
                new THREE.MeshStandardMaterial({
                  color: c,
                  roughness: 0.92,
                  metalness: 0.02,
                })
            )
          );
          initPos.push([x, y, z]);
          idx++;
        }
      }
    }

    return { scrambledCubies: cubies, materials: mats, initialPositions: initPos };
  }, []);

  const stateRef = useRef<{
    cubies: CubieData[];
    currentMoveIndex: number;
  }>({
    cubies: scrambledCubies.map(c => ({
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
      groupRef.current.rotation.y =
        -Math.PI / 4 + Math.sin(timeRef.current * 0.25) * 0.04;
      groupRef.current.rotation.x =
        Math.PI / 6 + Math.sin(timeRef.current * 0.18) * 0.025;
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
          Math.round(cubie.position.getComponent(axisIdx)) ===
          currentMove.layer
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
      {scrambledCubies.map((_, i) => (
        <mesh
          key={i}
          ref={el => {
            cubieRefs.current[i] = el;
          }}
          material={materials[i]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[CUBIE_SIZE, CUBIE_SIZE, CUBIE_SIZE]} />
        </mesh>
      ))}
    </group>
  );
}

export default function CubeCanvas({
  scrollProgress,
}: {
  scrollProgress: MutableRefObject<number>;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.5], fov: 40 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[6, 8, 5]}
        intensity={0.7}
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
      />
      <directionalLight position={[-4, -3, -3]} intensity={0.15} />
      <pointLight position={[0, 0, 6]} intensity={0.1} />
      <CubeInner scrollProgress={scrollProgress} />
    </Canvas>
  );
}
