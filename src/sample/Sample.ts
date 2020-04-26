import { CoreApp } from '../core/CoreApp';
import { Cube } from './Cube';
import { Color } from 'three';

export class Sample extends CoreApp {
    private brick!: Cube;

    // tslint:disable-next-line: no-empty
    protected beforeInit() {
    }

    protected afterInit() {
        this.brick = new Cube(100, new Color('rgb(255,0,0)'));
        this.scene.add(this.brick);
    }

    protected update() {
        this.brick.rotateY(0.03);
    }
}
