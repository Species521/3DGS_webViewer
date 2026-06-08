import { TransformNode, Vector3 } from "@babylonjs/core";
import { GaussianSplattingMesh } from "@babylonjs/core/Meshes/GaussianSplatting/gaussianSplattingMesh";
import "@babylonjs/loaders/SPLAT/splatFileLoader";

export default class SplatLoaderScript {
    private _attachedNode: TransformNode;
    private _fpsLabel: HTMLDivElement | null = null;

    constructor(attachedNode: TransformNode) {
        this._attachedNode = attachedNode;
    }

    public async onStart(): Promise<void> {
        console.log(">>> Splat loader initialized.");
        const targetUrl = "https://species521.github.io/3DGS_storage/clusterFly_M.ply";
        const scene = this._attachedNode.getScene();

        // FPS counter setup
        this._fpsLabel = document.createElement("div");
        this._fpsLabel.style.cssText = "position:fixed;top:10px;left:10px;color:white;font-size:16px;font-family:monospace;z-index:999;";
        document.body.appendChild(this._fpsLabel);

        scene.onAfterRenderObservable.add(() => {
            if (this._fpsLabel) {
                this._fpsLabel.textContent = `FPS: ${scene.getEngine().getFps().toFixed(1)}`;
            }
        });

        // Configure pre-AR View Camera (Pinch and Inverted Rotations)
        const activeCam = scene.activeCamera as any;
        if (activeCam) {
            activeCam.speed = 0.1;

            // Invert touch/drag dragging orientations
            if (activeCam.angularSensibilityX !== undefined) activeCam.angularSensibilityX = -Math.abs(activeCam.angularSensibilityX);
            if (activeCam.angularSensibilityY !== undefined) activeCam.angularSensibilityY = -Math.abs(activeCam.angularSensibilityY);
            
            // Adjust zoom sensitivity for mobile pinching
            if (activeCam.pinchPrecision !== undefined) activeCam.pinchPrecision = 12;

            console.log(">>> Desktop/Mobile flat screen camera interactions configured.");
        }

        // Load Splat using native constructor to avoid the asset collection invisibility bug
        try {
            const splatMesh = new GaussianSplattingMesh("ClusterFly_Splat", targetUrl, scene);
            
            // Wait safely for internal asynchronous buffers to build
            await splatMesh.loadFileAsync(targetUrl);

            splatMesh.parent = this._attachedNode;
            splatMesh.position = new Vector3(0, 0, 2);
            splatMesh.scaling.setAll(5);
            splatMesh.rotation.x = Math.PI;
            
            console.log(">>> Fly splat spawned successfully at 5x scale via Native GS Class.");
        } catch (error) {
            console.error(">>> Runtime error during configuration:", error);
        }
    }
}