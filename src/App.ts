import { Scene } from "@babylonjs/core/scene";
import { Engine } from "@babylonjs/core/Engines/engine";

import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { Color4, Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";

import { SceneLoaderFlags } from "@babylonjs/core/Loading/sceneLoaderFlags";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";
import HavokPhysics from "@babylonjs/havok";

import "@babylonjs/core/XR/features/WebXRDepthSensing";
import "@babylonjs/core/Physics";
import "@babylonjs/core/Loading/Plugins/babylonFileLoader";

import { WebXRSessionManager } from "@babylonjs/core/XR/webXRSessionManager";
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
        this._scene.clearColor = new Color4(0.1, 0.1, 0.1, 1.0);

        // --------------------------------------------------
        // CREATE WORLD ROOT (IMPORTANT)
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
        // 🧱 VISUAL BLOCKER LAYER
        // --------------------------------------------------
        // Since immersive-ar forces the canvas background to be transparent, 
        // we place a massive inverted sphere around the scene to act as a dark grey solid background.
        const bgShield = MeshBuilder.CreateSphere("bgShield", { diameter: 500, segments: 16 }, this._scene);
        const shieldMat = new StandardMaterial("shieldMat", this._scene);
        shieldMat.diffuseColor = new Color3(0.1, 0.1, 0.1);
        shieldMat.specularColor = new Color3(0, 0, 0);
        shieldMat.backFaceCulling = false; // Ensures it renders on the inside faces
        shieldMat.disableLighting = true;  // Keeps the dark grey completely flat and unlit
        bgShield.material = shieldMat;

        // --------------------------------------------------
        // XR SETUP (RESTORED EXACTLY AS ORIGINAL)
        // --------------------------------------------------
        try {
            const xrSupported =
                await WebXRSessionManager.IsSessionSupportedAsync("immersive-ar");

            if (!xrSupported) return;

            const xrHelper = await this._scene.createDefaultXRExperienceAsync({
                uiOptions: {
                    sessionMode: "immersive-ar",
                    referenceSpaceType: "local-floor",
                },
                disableDefaultUI: false,
            });

            // --------------------------------------------------
            // 🎯 WORLD GAIN SYSTEM (CORE FIX)
            // --------------------------------------------------
            this._scene.onBeforeRenderObservable.add(() => {
                const cam = this._scene?.activeCamera;
                if (!cam || !this._worldRoot) return;

                const xrCam = xrHelper.baseExperience.camera;

                // Only apply if XR tracking is active
                if (!xrCam) return;

                // --------------------------------------------------
                // Apply movement gain illusion:
                // we shift world slightly opposite to camera motion
                // --------------------------------------------------
                const p = cam.globalPosition;

                this._worldRoot.position.x = p.x * (1 - this._movementGain);
                this._worldRoot.position.z = p.z * (1 - this._movementGain);
            });

            console.log(">>> XR + Movement Gain system active");
        } catch (e) {
            console.error("XR init error:", e);
        }

        if (this._scene.activeCamera) {
            this._scene.activeCamera.attachControl();
        }
    }

    public setMovementGain(value: number) {
        this._movementGain = -3.0;
        console.log("Movement gain hard-coded to:", this._movementGain);
    }

    public dispose(): void {
        this._scene?.dispose();
        this._engine?.dispose();
    }
}