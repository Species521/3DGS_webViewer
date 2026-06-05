import { Scene } from "@babylonjs/core/scene";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color4 } from "@babylonjs/core/Maths/math.color";
import { SceneLoaderFlags } from "@babylonjs/core/Loading/sceneLoaderFlags";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";

import HavokPhysics from "@babylonjs/havok";

import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/core/Loading/Plugins/babylonFileLoader";
import "@babylonjs/core/Cameras/universalCamera";
import "@babylonjs/core/Meshes/groundMesh";
import "@babylonjs/core/Lights/directionalLight";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import "@babylonjs/core/Materials/PBR/pbrMaterial";
import "@babylonjs/core/Materials/standardMaterial";
import "@babylonjs/core/XR/features/WebXRDepthSensing";
import "@babylonjs/core/Rendering/depthRendererSceneComponent";
import "@babylonjs/core/Rendering/prePassRendererSceneComponent";
import "@babylonjs/core/Materials/Textures/Loaders/envTextureLoader";
import "@babylonjs/core/Physics";
import "@babylonjs/materials/sky";

import { WebXRSessionManager } from "@babylonjs/core/XR/webXRSessionManager";
import { loadScene } from "babylonjs-editor-tools";
import { scriptsMap } from "./scripts";

export class App {
	private _canvas: HTMLCanvasElement;
	private _engine: Engine | null = null;
	private _scene: Scene | null = null;

	public constructor() {
		const canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
		if (!canvasElement) {
			throw new Error("Canvas element not found");
		}
		this._canvas = canvasElement;
	}

	public async init(): Promise<void> {
		this._engine = new Engine(this._canvas, true, {
			stencil: true,
			antialias: true,
			audioEngine: true,
			adaptToDeviceRatio: true,
			disableWebGL2Support: false,
			useHighPrecisionFloats: true,
			powerPreference: "high-performance",
			failIfMajorPerformanceCaveat: false,
		});

		this._engine.setHardwareScalingLevel(1.35);

		this._scene = new Scene(this._engine);
		this._scene.clearColor = new Color4(0.1, 0.1, 0.1, 1.0);

		await this._handleLoad();

		const handleResize = () => {
			this._engine?.resize();
		};

		window.addEventListener("resize", handleResize);

		this._engine.runRenderLoop(() => {
			this._scene?.render();
		});
	}

	private async _handleLoad(): Promise<void> {
		if (!this._engine || !this._scene) {
			return;
		}

		const havok = await HavokPhysics();
		this._scene.enablePhysics(new Vector3(0, -981, 0), new HavokPlugin(true, havok));

		SceneLoaderFlags.ForceFullSceneLoadingForIncremental = true;
		
		await loadScene("./scene/", "example.babylon", this._scene, scriptsMap, {
			quality: "high",
		});

		// Configure the pre-AR starting scene camera controls
		const defaultCamera = this._scene.activeCamera as any;
		if (defaultCamera) {
			// Invert left-right (X axis) and up-down (Y axis) rotation sensitivity
			if (defaultCamera.angularSensibilityX !== undefined) {
				defaultCamera.angularSensibilityX = -Math.abs(defaultCamera.angularSensibilityX);
			}
			if (defaultCamera.angularSensibilityY !== undefined) {
				defaultCamera.angularSensibilityY = -Math.abs(defaultCamera.angularSensibilityY);
			}

			// For Target/Universal Cameras that use speed variants for dragging directions
			if (defaultCamera.inertia !== undefined) {
				// Ensures smooth deceleration curves remain intact while swapping orientation inputs
			}
		}

		// WebXR Immersive AR Configuration
		try {
			const xrSupported = await WebXRSessionManager.IsSessionSupportedAsync("immersive-ar");
			
			if (xrSupported) {
				const xrHelper = await this._scene.createDefaultXRExperienceAsync({
					uiOptions: {
						sessionMode: "immersive-ar",
						referenceSpaceType: "local-floor"
					},
					disableDefaultUI: false
				});

				if (xrHelper.baseExperience.camera) {
					xrHelper.baseExperience.camera.isStereoscopicSideBySide = false;
				}

				const correctiveScale = 0.25;
				let splatMesh: any = null;

				xrHelper.baseExperience.onStateChangedObservable.add((state) => {
					if (!splatMesh && this._scene) {
						splatMesh = this._scene.meshes.find(m => m.className === "SplatMesh" || m.name.includes("splat"));
					}

					if (state === 2) { // WebXRState.IN_XR
						const xrCamera = xrHelper.baseExperience.camera;
						if (xrCamera && this._scene) {
							xrCamera.backgroundReceiver = false;
							this._scene.autoClear = true;
							this._scene.autoClearDepthAndStencil = true;
							this._scene.clearColor = new Color4(0.1, 0.1, 0.1, 1.0);
						}

						if (splatMesh) {
							splatMesh.position.set(0, 1.5, -1.0);
							splatMesh.scaling.set(correctiveScale, correctiveScale, correctiveScale);
							console.log(">>> Entering AR: Corrective layout applied.");
						}
					} else if (state === 3) { // WebXRState.EXITING_XR
						if (splatMesh) {
							splatMesh.position.set(0, 0, 0);
							splatMesh.scaling.set(1.0, 1.0, 1.0);
						}
					}
				});

				console.log(">>> WebXR AR initialized with tracking configurations.");
			} else {
				console.warn(">>> WebXR Immersive AR is not supported on this browser/device.");
			}
		} catch (xrError) {
			console.error(">>> Error setting up WebXR:", xrError);
		}

		if (this._scene.activeCamera) {
			this._scene.activeCamera.attachControl(this._canvas, true);
		}
	}

	public dispose(): void {
		this._scene?.dispose();
		this._engine?.dispose();
	}
}