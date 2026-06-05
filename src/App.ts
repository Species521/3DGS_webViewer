import { Scene } from "@babylonjs/core/scene";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { SceneLoaderFlags } from "@babylonjs/core/Loading/sceneLoaderFlags";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";

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
	private _worldRoot: TransformNode | null = null;

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
		
		// 1. Create the parent world node first
		this._worldRoot = new TransformNode("worldRoot", this._scene);

		// 2. Automatically catch and parent any mesh added to the scene at any point
		this._scene.onNewMeshAddedObservable.add((mesh) => {
			// Avoid parenting the root node to itself
			if (mesh !== this._worldRoot && !mesh.parent) {
				mesh.setParent(this._worldRoot);
			}
		});

		// 3. Load the scene assets
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

				xrHelper.baseExperience.onStateChangedObservable.add((state) => {
					if (state === 2) { // WebXRState.IN_XR
						const xrCamera = xrHelper.baseExperience.camera;
						if (xrCamera && this._scene) {
							// Kill the actual hardware camera texture feed completely
							xrCamera.backgroundReceiver = false;
							
							// Force the scene background canvas routine to clear every frame
							this._scene.autoClear = true;
							this._scene.clearColor = this._scene.clearColor.clone();
						}

						// Pull the environment closer to your physical position by sliding 
						// the entire virtual world transform forward on the Z axis.
						if (this._worldRoot) {
							this._worldRoot.position.set(0, 0, 2.5);
							console.log(">>> World content brought 2.5m closer on AR enter.");
						}
					} 
					else if (state === 3) { // WebXRState.EXITING_XR
						// Reset world position back to the default origin for regular screen browsing
						if (this._worldRoot) {
							this._worldRoot.position.set(0, 0, 0);
						}
					}
				});

				console.log(">>> WebXR AR initialized successfully.");
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