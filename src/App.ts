import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";

import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
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

    private _movementGain = 1.0;

    constructor() {
        const canvas = document.getElementById(
            "canvas"
        ) as HTMLCanvasElement;

        if (!canvas) {
            throw new Error("Canvas not found");
        }

        this._canvas = canvas;
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

        this._scene.clearColor = new Color4(
            0.1,
            0.1,
            0.1,
            1
        );

        await this._handleLoad();

        window.addEventListener(
            "resize",
            () => this._engine?.resize()
        );

        this._engine.runRenderLoop(() => {
            this._scene?.render();
        });
    }

    private async _handleLoad(): Promise<void> {
        if (!this._scene) {
            return;
        }

        const scene = this._scene;

        // Physics

        const havok = await HavokPhysics();

        scene.enablePhysics(
            new Vector3(0, -9.81, 0),
            new HavokPlugin(true, havok)
        );

        // Load Babylon Editor scene

        SceneLoaderFlags.ForceFullSceneLoadingForIncremental =
            true;

        await loadScene(
            "./scene/",
            "example.babylon",
            scene,
            scriptsMap,
            {
                quality: "high",
            }
        );

        // Dark background sphere

        const bgShield = MeshBuilder.CreateSphere(
            "bgShield",
            {
                diameter: 500,
                segments: 16,
            },
            scene
        );

        const shieldMat = new StandardMaterial(
            "shieldMat",
            scene
        );

        shieldMat.diffuseColor = new Color3(
            0.1,
            0.1,
            0.1
        );

        shieldMat.specularColor = new Color3(
            0,
            0,
            0
        );

        shieldMat.backFaceCulling = false;
        shieldMat.disableLighting = true;

        bgShield.material = shieldMat;

        // WebXR

        try {
            const xrSupported =
                await WebXRSessionManager.IsSessionSupportedAsync(
                    "immersive-ar"
                );

            if (!xrSupported) {
                return;
            }

            const xrHelper =
                await scene.createDefaultXRExperienceAsync({
                    uiOptions: {
                        sessionMode: "immersive-ar",
                        referenceSpaceType: "local-floor",
                    },

                    disableDefaultUI: false,
                });

            const movementScale = 8;

            let initialPhysicalPos: Vector3 | null =
                null;

            scene.onBeforeRenderObservable.add(() => {
                const xrCam =
                    xrHelper.baseExperience.camera;

                if (!xrCam) {
                    return;
                }

                const currentPhysicalPos =
                    xrCam.position;

                if (!initialPhysicalPos) {
                    initialPhysicalPos =
                        currentPhysicalPos.clone();

                    return;
                }

                const physicalDeltaX =
                    currentPhysicalPos.x -
                    initialPhysicalPos.x;

                const physicalDeltaZ =
                    currentPhysicalPos.z -
                    initialPhysicalPos.z;

                xrCam.position.x =
                    initialPhysicalPos.x +
                    physicalDeltaX *
                        movementScale;

                xrCam.position.z =
                    initialPhysicalPos.z +
                    physicalDeltaZ *
                        movementScale;
            });

            console.log(
                ">>> XR + Working Movement Gain active."
            );
        } catch (e) {
            console.error(
                "XR init error:",
                e
            );
        }

        scene.activeCamera?.attachControl();
    }

    public setMovementGain(
        value: number
    ): void {
        this._movementGain = value;

        console.log(
            "Movement gain:",
            this._movementGain
        );
    }

    public dispose(): void {
        this._scene?.dispose();
        this._engine?.dispose();
    }
}