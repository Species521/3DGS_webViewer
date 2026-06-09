import { TransformNode, ImportMeshAsync, Vector3 } from "@babylonjs/core";
import "@babylonjs/loaders/SPLAT/splatFileLoader";

import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture";
import { TextBlock } from "@babylonjs/gui/2D/controls/textBlock";

export default class SplatLoaderScript {
    private _attachedNode: TransformNode;
    private _fpsText: TextBlock | null = null;

    constructor(attachedNode: TransformNode) {
        this._attachedNode = attachedNode;
    }

    public async onStart(): Promise<void> {
        console.log(">>> Splat loader initialized.");

        const targetUrl =
            "https://species521.github.io/3DGS_storage/clusterFly_S.ply";

        const scene = this._attachedNode.getScene();

        // --------------------------------------------------
        // Babylon GUI FPS Counter
        // --------------------------------------------------

        const gui = AdvancedDynamicTexture.CreateFullscreenUI(
            "FPS_UI",
            true,
            scene
        );

        this._fpsText = new TextBlock();
        this._fpsText.text = "FPS: 0";
        this._fpsText.color = "white";
        this._fpsText.fontSize = 24;
        this._fpsText.top = "-45%";
        this._fpsText.left = "-40%";
        this._fpsText.textHorizontalAlignment = 0;
        this._fpsText.textVerticalAlignment = 0;

        gui.addControl(this._fpsText);

        scene.onAfterRenderObservable.add(() => {
            if (this._fpsText) {
                this._fpsText.text =
                    "FPS: " +
                    scene.getEngine().getFps().toFixed(1);
            }
        });

        // --------------------------------------------------
        // Slow camera movement
        // --------------------------------------------------

        if (scene.activeCamera) {
            scene.activeCamera.speed = 0.1;
            console.log(
                `>>> Camera speed reduced to: ${scene.activeCamera.speed}`
            );
        }

        // --------------------------------------------------
        // Load Splat
        // --------------------------------------------------

        try {
            const result = await ImportMeshAsync(
                targetUrl,
                scene,
                null,
                ".splat"
            );

            const splatMesh = result.meshes[0];

            if (splatMesh) {
                splatMesh.name = "ClusterFly_Splat";
                splatMesh.parent = this._attachedNode;

                splatMesh.position = new Vector3(0, 0, 2);
                splatMesh.scaling.setAll(5);
                // splatMesh.rotation.x = Math.PI;

                console.log(
                    ">>> Fly splat spawned at 5x scale at (0,0,2)."
                );
            }
        } catch (error) {
            console.error(
                ">>> Runtime error during configuration:",
                error
            );
        }
    }
}