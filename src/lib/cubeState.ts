import * as THREE from 'three';

export type Axis = 'x' | 'y' | 'z';

export interface Move {
  axis: Axis;
  layer: number;
  angle: number;
}

export interface CubieData {
  id: number;
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
}

export function getAxisIndex(axis: Axis): number {
  switch (axis) {
    case 'x': return 0;
    case 'y': return 1;
    case 'z': return 2;
  }
}

export function getAxisVector(axis: Axis): THREE.Vector3 {
  switch (axis) {
    case 'x': return new THREE.Vector3(1, 0, 0);
    case 'y': return new THREE.Vector3(0, 1, 0);
    case 'z': return new THREE.Vector3(0, 0, 1);
  }
}

export function createInitialCubies(): CubieData[] {
  const cubies: CubieData[] = [];
  let id = 0;
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        cubies.push({
          id: id++,
          position: new THREE.Vector3(x, y, z),
          quaternion: new THREE.Quaternion(),
        });
      }
    }
  }
  return cubies;
}

export function applyMove(cubies: CubieData[], move: Move): CubieData[] {
  const axisVec = getAxisVector(move.axis);
  const idx = getAxisIndex(move.axis);
  const rotQ = new THREE.Quaternion().setFromAxisAngle(axisVec, move.angle);

  return cubies.map(cubie => {
    if (Math.round(cubie.position.getComponent(idx)) !== move.layer) {
      return {
        ...cubie,
        position: cubie.position.clone(),
        quaternion: cubie.quaternion.clone(),
      };
    }

    const newPos = cubie.position.clone().applyQuaternion(rotQ);
    newPos.x = Math.round(newPos.x);
    newPos.y = Math.round(newPos.y);
    newPos.z = Math.round(newPos.z);

    const newQuat = rotQ.clone().multiply(cubie.quaternion.clone());

    return {
      ...cubie,
      position: newPos,
      quaternion: newQuat,
    };
  });
}

const HP = Math.PI / 2;

export const SCRAMBLE_MOVES: Move[] = [
  { axis: 'x', layer: 1, angle: HP },
  { axis: 'y', layer: 1, angle: HP },
  { axis: 'z', layer: 1, angle: -HP },
  { axis: 'y', layer: -1, angle: HP },
  { axis: 'x', layer: -1, angle: HP },
  { axis: 'z', layer: -1, angle: HP },
  { axis: 'x', layer: 1, angle: -HP },
  { axis: 'y', layer: 1, angle: -HP },
  { axis: 'z', layer: 1, angle: HP },
  { axis: 'y', layer: -1, angle: -HP },
  { axis: 'x', layer: 0, angle: HP },
  { axis: 'z', layer: 0, angle: -HP },
  { axis: 'y', layer: 0, angle: HP },
  { axis: 'x', layer: -1, angle: -HP },
  { axis: 'z', layer: 1, angle: -HP },
  { axis: 'y', layer: 1, angle: HP },
];

export const SOLVE_MOVES: Move[] = [...SCRAMBLE_MOVES].reverse().map(m => ({
  ...m,
  angle: -m.angle,
}));

export function getScrambledCubies(): CubieData[] {
  let cubies = createInitialCubies();
  for (const move of SCRAMBLE_MOVES) {
    cubies = applyMove(cubies, move);
  }
  return cubies;
}
