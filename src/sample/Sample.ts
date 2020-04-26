import { CoreApp } from '../core/CoreApp';
import { Cube } from './Cube';
import { Color } from 'three';

export class Sample extends CoreApp {
    private cube!: Cube;

    // tslint:disable-next-line: no-empty
    protected beforeInit() {
    }

    protected afterInit() {
        this.cube = new Cube(100, new Color('rgb(255,0,0)'));
        this.scene.add(this.cube);
    }

    protected update() {
        this.cube.rotateY(0.01);
    }
}
