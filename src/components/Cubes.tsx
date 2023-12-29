import cubes from '../utils/cubeCoords.json';
import { Cube } from '../models/Cube.tsx';

export const Cubes = () => cubes.map(coords => <Cube key={coords[0]} position={coords} />);
