import { TransformNode, ImportMeshAsync, Vector3 } from "@babylonjs/core";
import "@babylonjs/loaders/SPLAT/splatFileLoader";

export default class SplatLoaderScript {
    private _attachedNode: TransformNode;

    constructor(attachedNode: TransformNode) {
        this._attachedNode = attachedNode;
    }

    public async onStart(): Promise<void> {
        console.log(">>> Splat loader initialized.");

        const targetUrl = "https://species521.github.io/3DGS_storage/clusterFly_M.compressed.ply";
        const scene = this._attachedNode.getScene();

        // --- Fix 2: Tame the Player/Camera Movement Speed ---
        // We look for the active camera currently rendering the scene
        if (scene.activeCamera) {
            scene.activeCamera.speed = 0.1; 
            console.log(`>>> Camera speed reduced to: ${scene.activeCamera.speed}`);
        }

        try {
            const result = await ImportMeshAsync(targetUrl, scene, null, ".splat");
            const splatMesh = result.meshes[0];
            
            if (splatMesh) {
                splatMesh.name = "ClusterFly_Splat";
                splatMesh.parent = this._attachedNode;
                splatMesh.position = new Vector3(0, 0, 2);
                
                // --- Fix 1: Scale the Splat 5x Bigger ---
                splatMesh.scaling.setAll(5);
		splatMesh.rotation.x = Vector3.ToRadians(180);
                
                console.log(">>> Fly splat spawned at 5x scale at (0, 0, 2).");
            }
        } catch (error) {
            console.error(">>> Runtime error during configuration:", error);
        }
    }
}