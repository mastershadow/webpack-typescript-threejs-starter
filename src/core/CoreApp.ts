import {
    Color,
    PerspectiveCamera,
    Scene,
    Vector3,
    WebGLRenderer,
    Camera,
    HemisphereLight,
    HemisphereLightHelper,
    DirectionalLight,
    DirectionalLightHelper,
} from 'three';

import { ResizeObserver } from '@juggle/resize-observer';

export abstract class CoreApp {
    protected _scene: Scene;
    protected _camera!: PerspectiveCamera;
    protected _renderer!: WebGLRenderer;
    protected _canvasElement!: HTMLCanvasElement;
    protected _canvasWrapperElement!: HTMLElement;

    protected far: number = 10000;
    protected near: number = 0.1;
    protected fov: number = 45;
    protected cameraPosition: Vector3 = new Vector3(0, 100, 400);
    protected cameraLookAt: Vector3 = new Vector3(0, 0, 0);
    protected canvasId: string = 'renderingcanvas';
    protected canvasWrapperId: string = 'canvaswrapper';
    protected antialias: boolean = true;
    protected showLightHelpers: boolean = true;
    protected clearColor: Color = new Color(0x222222);
    protected abstract beforeInit(): void;
    protected abstract afterInit(): void;
    protected abstract update(): void;

    protected resizeTimeout: number = 100;
    protected resizeTimeoutHandle: number | null = null;

    public constructor() {
        this.beforeInit();
        this._canvasElement = document.getElementById(
            this.canvasId
        ) as HTMLCanvasElement;

        this._canvasWrapperElement = document.getElementById(
            this.canvasWrapperId
        ) as HTMLCanvasElement;
        this._scene = new Scene();
        this.initCamera();
        this.initRenderer();
        this.initLighting();

        this.initResizeObserver();

        this.afterInit();
    }

    protected initResizeObserver() {
        const ro = new ResizeObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                const {
                    inlineSize: width,
                    blockSize: height,
                } = entry.contentBoxSize[0];
                if (this.resizeTimeoutHandle != null) {
                    window.clearTimeout(this.resizeTimeoutHandle);
                }
                this.resizeTimeoutHandle = window.setTimeout(() => {
                    this.adjustCanvasSize(width, height);
                    this.resizeTimeoutHandle = null;
                }, this.resizeTimeout);
            });
        });
        ro.observe(this.canvasWrapperElement);
    }

    protected initRenderer() {
        this._renderer = new WebGLRenderer({
            antialias: this.antialias,
            canvas: this.canvasElement,
        });
        this.renderer.setSize(innerWidth, innerHeight);
        this.renderer.setClearColor(this.clearColor);
    }

    protected initLighting() {
        this.initLightingHemi();
        this.initLightingDirectional();
    }

    private initLightingDirectional() {
        const dirLight = new DirectionalLight(0xffffff, 0.9);
        dirLight.color.setHSL(0.1, 1, 0.95);
        dirLight.position.set(1, 1, 1);
        dirLight.position.multiplyScalar(100);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        const d = 50;
        dirLight.shadow.camera.left = -d;
        dirLight.shadow.camera.right = d;
        dirLight.shadow.camera.top = d;
        dirLight.shadow.camera.bottom = -d;
        dirLight.shadow.camera.far = 3500;
        dirLight.shadow.bias = -0.0001;
        this.scene.add(dirLight);
        if (this.showLightHelpers) {
            const dirLightHeper = new DirectionalLightHelper(dirLight, 10);
            this.scene.add(dirLightHeper);
        }
    }

    private initLightingHemi() {
        const hemiLight = new HemisphereLight(0xffffff, 0xffffff, 0.8);
        hemiLight.color.setHSL(0.6, 1, 0.6);
        hemiLight.groundColor.setHSL(0.095, 1, 0.75);
        hemiLight.position.set(0, 100, 0);
        this.scene.add(hemiLight);
        if (this.showLightHelpers) {
            const hemiLightHelper = new HemisphereLightHelper(hemiLight, 10);
            this.scene.add(hemiLightHelper);
        }
    }

    protected initCamera() {
        this._camera = new PerspectiveCamera(
            this.fov,
            innerWidth / innerHeight,
            this.near,
            this.far
        );
        this.camera.position.copy(this.cameraPosition);
        this.camera.lookAt(this.cameraLookAt);
    }

    protected adjustCanvasSize(w: number, h: number) {
        this.renderer.setSize(w, h);
        if (this.camera instanceof PerspectiveCamera) {
            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
        }
    }

    public render() {
        this.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.render());
    }

    public get scene(): Scene {
        return this._scene;
    }

    public get canvasElement(): HTMLCanvasElement {
        return this._canvasElement;
    }

    public get canvasWrapperElement(): HTMLElement {
        return this._canvasWrapperElement;
    }

    public get camera(): Camera {
        return this._camera;
    }

    public get renderer(): WebGLRenderer {
        return this._renderer;
    }
}
