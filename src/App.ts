import { Scene } from "@babylonjs/core/scene";
import { Engine } from "@babylonjs/core/Engines/engine";

import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";

import { SceneLoaderFlags } from "@babylonjs/core/Loading/sceneLoaderFlags";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";
import HavokPhysics from "@babylonjs/havok";

// Swapping to ArcRotateCamera for clean interaction and zero distortion
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";

import "@babylonjs/core/Physics";
import "@babylonjs/core/Loading/Plugins/babylonFileLoader";

import { loadScene } from "babylonjs-editor-tools";
import { scriptsMap } from "./scripts";

export class App {
    private _canvas: HTMLCanvasElement;
    private _engine: Engine | null = null;
    private _scene: Scene | null = null;

    // --------------------------------------------------
    // 🎯 MOVEMENT GAIN (YOUR TUNING KNOB)
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

        this._engine.setHardwareScalingLevel(1.0); // Clean 1:1 scaling prevents blurring

        this._scene = new Scene(this._engine);
        
        // This solid dark background is now 100% guaranteed to work safely
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
        // 📱 INTERACTIVE CAMERA SETUP (TOUCH + POSITION)
        // --------------------------------------------------
        // Arguments: name, alpha (rotation), beta (tilt), radius (distance), target, scene
        const camera = new ArcRotateCamera(
            "InteractiveCam",
            Math.PI / 2, // Facing forward
            Math.PI / 2.5, // Slightly tilted down looking at the object
            5, // Starting distance from the target
            new Vector3(0, 0, 2), // Targets the exact spot your fly splat spawns
            this._scene
        );

        // Attach controls to allow finger-dragging, panning, and pinching
        camera.attachControl(this._canvas, true);
        this._scene.activeCamera = camera;

        // Tweak camera bounds so it feels nice on phones
        camera.lowerRadiusLimit = 1;  // Prevent zooming inside the fly
        camera.upperRadiusLimit = 20; // Prevent zooming too far away
        camera.wheelDeltaPercentage = 0.01; // Smooth scroll/pinch zooming

        // --------------------------------------------------
        // 🎯 WORLD GAIN SYSTEM (DRIVEN BY INTERACTION)
        // --------------------------------------------------
        this._scene.onBeforeRenderObservable.add(() => {
            if (!this._worldRoot || !this._scene?.activeCamera) return;

            const cam = this._scene.activeCamera;
            const p = cam.globalPosition;

            // Shift the world dynamically based on camera positional drift
            this._worldRoot.position.x = p.x * (1 - this._movementGain);
            this._worldRoot.position.z = p.z * (1 - this._movementGain);
        });

        console.log(">>> Interactive Magic Window active. Multi-touch tracking running.");
    }

    public setMovementGain(value: number) {
        this._movementGain = value; 
        console.log("Movement gain set to:", value);
    }

    public dispose(): void {
        this._scene?.dispose();
        this._engine?.dispose();
    }
}