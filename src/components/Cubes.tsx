import cubes from '../utils/cubeCoords.json';
import { Cube } from './Cube.tsx';

export const Cubes = () => {
  return cubes.map((coords, index) => <Cube key={index} position={coords} />);
}
