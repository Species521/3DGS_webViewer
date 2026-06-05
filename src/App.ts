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

				// Global tracking references for our runtime loop
				let splatMesh: any = null;
				let frameCounter = 0;

				// Distance-Based Pruning Loop (Triggers before every frame render)
				this._scene.onBeforeRenderObservable.add(() => {
					// Cache the splat mesh reference once it finishes streaming in
					if (!splatMesh && this._scene) {
						splatMesh = this._scene.meshes.find(m => m.className === "SplatMesh" || m.name.includes("splat"));
					}

					const camera = this._scene?.activeCamera;
					if (splatMesh && camera) {
						frameCounter++;

						// Optimization: Only compute distance calculation every 2 frames to save CPU cycles
						if (frameCounter % 2 === 0) {
							const currentDistance = Vector3.Distance(camera.globalPosition, splatMesh.getAbsolutePosition());

							// Define boundary thresholds (in meters)
							const closeLimit = 0.5; // Point where thinning is maximum
							const farLimit = 2.0;   // Point where the splat renders at full original density

							if (currentDistance < farLimit) {
								// Calculate linear interpolation factor between 0.0 and 1.0
								const factor = (currentDistance - closeLimit) / (farLimit - closeLimit);
								const clampedFactor = Math.max(0.3, Math.min(1.0, factor)); // Clamp scale floor at 30% density minimum

								splatMesh.scaling.set(clampedFactor, clampedFactor, clampedFactor);
							} else {
								// Restore normal scale when standing further away
								if (splatMesh.scaling.x !== 1.0) {
									splatMesh.scaling.set(1.0, 1.0, 1.0);
								}
							}
						}
					}
				});

				xrHelper.baseExperience.onStateChangedObservable.add((state) => {
					if (state === 2) { // WebXRState.IN_XR
						const xrCamera = xrHelper.baseExperience.camera;
						if (xrCamera && this._scene) {
							xrCamera.backgroundReceiver = false;
							this._scene.autoClear = true;
							this._scene.clearColor = new Color4(0.1, 0.1, 0.1, 1.0);
						}

						if (splatMesh) {
							splatMesh.position.set(0, 1.5, -1.0);
							console.log(">>> Splat position shifted up and closer for single-view AR.");
						}
					} else if (state === 3) { // WebXRState.EXITING_XR
						if (splatMesh) {
							splatMesh.position.set(0, 0, 0);
							splatMesh.scaling.set(1.0, 1.0, 1.0); // Reset scaling bounds
						}
					}
				});

				console.log(">>> WebXR AR initialized with runtime density pruning.");
			} else {
				console.warn(">>> WebXR Immersive AR is not supported on this browser/device.");
			}
		} catch (xrError) {
			console.error(">>> Error setting up WebXR:", xrError);
		}

		if (this._scene.activeCamera) {
			this._scene.activeCamera.attachControl();
		}
	}

	public dispose(): void {
		this._scene?.dispose();
		this._engine?.dispose();
	}
}