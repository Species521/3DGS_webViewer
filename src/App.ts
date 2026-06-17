import { Scene } from "@babylonjs/core/scene";
import { Engine } from "@babylonjs/core/Engines/engine";

import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";

import { SceneLoaderFlags } from "@babylonjs/core/Loading/sceneLoaderFlags";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";
import HavokPhysics from "@babylonjs/havok";

import { DeviceOrientationCamera } from "@babylonjs/core/Cameras/deviceOrientationCamera";

import "@babylonjs/core/Physics";
import "@babylonjs/core/Loading/Plugins/babylonFileLoader";

import { loadScene } from "babylonjs-editor-tools";
import { scriptsMap } from "./scripts";

export class App {
    private _canvas: HTMLCanvasElement;
    private _engine: Engine | null = null;
    private _scene: Scene | null = null;

    // --------------------------------------------------
    // 🎯 MOVEMENT GAIN (THIS IS YOUR TUNING KNOB)
    // --------------------------------------------------
    private _movementGain: number = 1.0;

    private _worldRoot: TransformNode | null = null;

    public constructor() {
        const canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
        if (!canvasElement) throw new Error("Canvas not found");
        this._canvas = canvasElement;
    }

    public async init(): Promise<void> {
        this._engine = new Engine(this._canvas, true, {
            stencil: true,
            antialias: true,
            audioEngine: true,
            adaptToDeviceRatio: true,
        });

        this._engine.setHardwareScalingLevel(1.35);

        this._scene = new Scene(this._engine);
        
        // Solid dark grey background remains visible (no WebXR passthrough overriding it)
        this._scene.clearColor = new Color4(0.1, 0.1, 0.1, 1.0);

        // --------------------------------------------------
        // CREATE WORLD ROOT
        // --------------------------------------------------
        this._worldRoot = new TransformNode("WorldRoot", this._scene);
        this._worldRoot.scaling.setAll(1);

        await this._handleLoad();

        window.addEventListener("resize", () => this._engine?.resize());

        this._engine.runRenderLoop(() => {
            this._scene?.render();
        });
    }

    private async _handleLoad(): Promise<void> {
        if (!this._scene) return;

        const havok = await HavokPhysics();
        this._scene.enablePhysics(new Vector3(0, -9.81, 0), new HavokPlugin(true, havok));

        SceneLoaderFlags.ForceFullSceneLoadingForIncremental = true;

        await loadScene("./scene/", "example.babylon", this._scene, scriptsMap, {
            quality: "high",
        });

        // --------------------------------------------------
        // 📱 MAGIC WINDOW SETUP (DEVICE ORIENTATION)
        // --------------------------------------------------
        const magicWindowCam = new DeviceOrientationCamera(
            "MagicWindowCam",
            new Vector3(0, 1.6, 0), // Positioned at standard standing eye height
            this._scene
        );

        // Enable gyroscope tracking based on device rotation
        magicWindowCam.attachControl(this._canvas, true);
        this._scene.activeCamera = magicWindowCam;

        // --------------------------------------------------
        // 🎯 WORLD GAIN SYSTEM (ADAPTED FOR MAGIC WINDOW)
        // --------------------------------------------------
        this._scene.onBeforeRenderObservable.add(() => {
            if (!this._worldRoot || !this._scene?.activeCamera) return;

            const cam = this._scene.activeCamera;
            const p = cam.globalPosition;

            // Shift world slightly opposite to camera translation motion
            this._worldRoot.position.x = p.x * (1 - this._movementGain);
            this._worldRoot.position.z = p.z * (1 - this._movementGain);
        });

        console.log(">>> Magic Window + Movement Gain system active");
    }

    public setMovementGain(value: number) {
        // Keeping your tuning parameter logic, fixed the hardcoded 323 assignment
        this._movementGain = value; 
        console.log("Movement gain set to:", value);
    }

    public dispose(): void {
        this._scene?.dispose();
        this._engine?.dispose();
    }
}