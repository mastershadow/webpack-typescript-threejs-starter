import { BoxGeometry, Color, Mesh, MeshLambertMaterial } from 'three';

export class Cube extends Mesh {
  constructor(size: number, color: Color) {
    super();
    this.geometry = new BoxGeometry(size, size, size);
    this.material = new MeshLambertMaterial({ color });
  }
}
