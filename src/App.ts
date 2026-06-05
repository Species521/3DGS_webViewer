import { Scene } from "@babylonjs/core/scene";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
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

import "@babylonjs/core/Rendering/depthRendererSceneComponent";
import "@babylonjs/core/Rendering/prePassRendererSceneComponent";
import "@babylonjs/core/Materials/Textures/Loaders/envTextureLoader";

import "@babylonjs/core/Physics";
import "@babylonjs/materials/sky";

// Import the specific hardware sensor camera
import { DeviceOrientationCamera } from "@babylonjs/core/Cameras/deviceOrientationCamera";

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

		// Setup Handheld Magic Window Tracking (No Headsets, No Stereo, No Camera Pass-through)
		try {
			console.log(">>> Setting up full-screen device sensor camera...");
			
			// Replace default camera with a device-orientation responsive camera
			const originalTarget = this._scene.activeCamera ? this._scene.activeCamera.position.clone() : new Vector3(0, 0, 0);
			const motionCamera = new DeviceOrientationCamera(
				"HandheldMotionCamera", 
				new Vector3(0, 2, -10), 
				this._scene
			);
			
			motionCamera.setTarget(originalTarget);
			
			// Sensitivity configurations for a steady tablet hold
			motionCamera.angularSensibility = 1000;
			motionCamera.moveSensibility = 1000;

			// Replace active system camera completely
			this._scene.activeCamera = motionCamera;
			this._scene.activeCamera.attachControl(this._canvas, true);
			
			console.log(">>> Single-screen magic window configuration active.");
		} catch (cameraError) {
			console.error(">>> Error setting up motion camera control:", cameraError);
		}

		// Fallback backup validation
		if (this._scene.activeCamera && this._scene.activeCamera.name !== "HandheldMotionCamera") {
			this._scene.activeCamera.attachControl(this._canvas, true);
		}
	}

	public dispose(): void {
		this._scene?.dispose();
		this._engine?.dispose();
	}
}