import { TransformNode, ImportMeshAsync, Vector3 } from "@babylonjs/core";
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

        // FPS counter
        this._fpsLabel = document.createElement("div");
        this._fpsLabel.style.cssText = "position:fixed;top:10px;left:10px;color:white;font-size:16px;font-family:monospace;z-index:999;";
        document.body.appendChild(this._fpsLabel);

        scene.onAfterRenderObservable.add(() => {
            if (this._fpsLabel) {
                this._fpsLabel.textContent = `FPS: ${scene.getEngine().getFps().toFixed(1)}`;
            }
        });

        // Camera speed
        if (scene.activeCamera) {
            scene.activeCamera.speed = 0.1;
            console.log(`>>> Camera speed reduced to: ${scene.activeCamera.speed}`);
        }

        // Load splat
        try {
            const result = await ImportMeshAsync(targetUrl, scene, null, ".splat");
            const splatMesh = result.meshes[0];

            if (splatMesh) {
                splatMesh.name = "ClusterFly_Splat";
                splatMesh.parent = this._attachedNode;
                splatMesh.position = new Vector3(0, 0, 2);
                splatMesh.scaling.setAll(5);
                // splatMesh.rotation.x = Math.PI;
                console.log(">>> Fly splat spawned at 5x scale at (0, 0, 2).");
            }
        } catch (error) {
            console.error(">>> Runtime error during configuration:", error);
        }
    }
}