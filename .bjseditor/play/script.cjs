var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};

// ../../PROJECTS/BABYLON_JS/project_002/src/scripts.ts
var scripts_exports = {};
__export(scripts_exports, {
  _applyScriptsForObject: () => _applyScriptsForObject,
  _preloadScriptsAssets: () => _preloadScriptsAssets,
  _removeRegisteredScriptInstance: () => _removeRegisteredScriptInstance,
  loadScene: () => loadScene,
  scriptAssetsCache: () => scriptAssetsCache,
  scriptsDictionary: () => scriptsDictionary,
  scriptsMap: () => scriptsMap
});
module.exports = __toCommonJS(scripts_exports);

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/loading/loader.js
var import_babylonjs55 = require("babylonjs");
var import_babylonjs56 = require("babylonjs");
var import_babylonjs57 = require("babylonjs");
var import_babylonjs58 = require("babylonjs");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/tools/guards.js
function isAbstractMesh(object) {
  switch (object.getClassName?.()) {
    case "Mesh":
    case "LineMesh":
    case "GroundMesh":
    case "InstancedMesh":
      return true;
  }
  return false;
}
__name(isAbstractMesh, "isAbstractMesh");
function isMesh(object) {
  switch (object.getClassName?.()) {
    case "Mesh":
    case "GroundMesh":
      return true;
  }
  return false;
}
__name(isMesh, "isMesh");
function isInstancedMesh(object) {
  return object.getClassName?.() === "InstancedMesh";
}
__name(isInstancedMesh, "isInstancedMesh");
function isTransformNode(object) {
  return object.getClassName?.() === "TransformNode";
}
__name(isTransformNode, "isTransformNode");
function isTexture(object) {
  return object?.getClassName?.() === "Texture";
}
__name(isTexture, "isTexture");
function isCamera(object) {
  switch (object.getClassName?.()) {
    case "Camera":
    case "FreeCamera":
    case "TargetCamera":
    case "EditorCamera":
    case "ArcRotateCamera":
    case "UniversalCamera":
      return true;
  }
  return false;
}
__name(isCamera, "isCamera");
function isLight(object) {
  switch (object.getClassName?.()) {
    case "Light":
    case "PointLight":
    case "SpotLight":
    case "DirectionalLight":
    case "HemisphericLight":
      return true;
  }
  return false;
}
__name(isLight, "isLight");
function isClusteredLightContainer(object) {
  return object.getClassName?.() === "ClusteredLightContainer";
}
__name(isClusteredLightContainer, "isClusteredLightContainer");
function isNode(object) {
  return isAbstractMesh(object) || isTransformNode(object) || isLight(object) || isCamera(object);
}
__name(isNode, "isNode");
function isScene(object) {
  return object.getClassName?.() === "Scene";
}
__name(isScene, "isScene");
function isParticleSystem(object) {
  return object.getClassName?.() === "ParticleSystem";
}
__name(isParticleSystem, "isParticleSystem");
function isAnyParticleSystem(object) {
  switch (object.getClassName?.()) {
    case "ParticleSystem":
    case "GPUParticleSystem":
      return true;
  }
  return false;
}
__name(isAnyParticleSystem, "isAnyParticleSystem");
function isSprite(object) {
  return object.getClassName?.() === "Sprite";
}
__name(isSprite, "isSprite");
function isSoundNode(object) {
  return isTransformNode(object) && object.isSoundNode === true;
}
__name(isSoundNode, "isSoundNode");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/tools/mesh.js
function configureMeshDistanceOrScreenCoverage(scene) {
  scene.meshes.forEach((mesh) => {
    if (!isMesh(mesh)) {
      return;
    }
    mesh.getLODLevels().forEach((lod) => {
      if (lod.mesh) {
        lod.mesh.originalDistanceOrScreenCoverage = lod.distanceOrScreenCoverage;
      }
    });
  });
}
__name(configureMeshDistanceOrScreenCoverage, "configureMeshDistanceOrScreenCoverage");
function applyMeshesLODQuality(quality, scene) {
  scene.meshes.forEach((mesh) => {
    if (!isMesh(mesh)) {
      return;
    }
    mesh.getLODLevels().forEach((lod) => {
      if (!lod.mesh?.originalDistanceOrScreenCoverage) {
        return;
      }
      switch (quality) {
        case "very-low":
          lod.distanceOrScreenCoverage = lod.mesh.originalDistanceOrScreenCoverage * 0.125;
          break;
        case "low":
          lod.distanceOrScreenCoverage = lod.mesh.originalDistanceOrScreenCoverage * 0.25;
          break;
        case "medium":
          lod.distanceOrScreenCoverage = lod.mesh.originalDistanceOrScreenCoverage * 0.5;
          break;
        case "high":
          lod.distanceOrScreenCoverage = lod.mesh.originalDistanceOrScreenCoverage;
          break;
      }
    });
  });
}
__name(applyMeshesLODQuality, "applyMeshesLODQuality");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/tools/light.js
var import_babylonjs = require("babylonjs");
var import_babylonjs2 = require("babylonjs");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/tools/scalar.js
function getPowerOfTwoUntil(limit) {
  let size = 1;
  while (size <= limit) {
    size <<= 1;
  }
  return size >> 1;
}
__name(getPowerOfTwoUntil, "getPowerOfTwoUntil");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/tools/light.js
function configureShadowMapRenderListPredicate(scene) {
  scene.lights.forEach((light) => {
    const shadowMap = light.getShadowGenerator()?.getShadowMap();
    if (!shadowMap) {
      return;
    }
    shadowMap.renderListPredicate = (mesh) => {
      const distance = import_babylonjs.Vector3.Distance(mesh.getAbsolutePosition(), light.getAbsolutePosition());
      return distance <= light.range;
    };
  });
}
__name(configureShadowMapRenderListPredicate, "configureShadowMapRenderListPredicate");
async function configureShadowMapRefreshRate(scene) {
  scene.executeWhenReady(() => {
    scene.lights.forEach((light) => {
      const shadowMap = light.getShadowGenerator()?.getShadowMap();
      if (shadowMap) {
        shadowMap.refreshRate = light.metadata?.refreshRate ?? import_babylonjs2.RenderTargetTexture.REFRESHRATE_RENDER_ONEVERYFRAME;
      }
    });
  });
}
__name(configureShadowMapRefreshRate, "configureShadowMapRefreshRate");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/rendering/vls.js
var import_babylonjs3 = require("babylonjs");
var import_babylonjs4 = require("babylonjs");
var import_babylonjs5 = require("babylonjs");
var vlsPostProcess = null;
var vlsPostProcessCameraConfigurations = /* @__PURE__ */ new Map();
function disposeVLSPostProcess(scene) {
  if (vlsPostProcess && scene.activeCamera) {
    vlsPostProcess.dispose(scene.activeCamera);
    vlsPostProcess = null;
  }
}
__name(disposeVLSPostProcess, "disposeVLSPostProcess");
function createVLSPostProcess(scene, mesh) {
  mesh ??= scene.meshes.find((mesh2) => isMesh(mesh2));
  vlsPostProcess = new import_babylonjs5.VolumetricLightScatteringPostProcess("VolumetricLightScatteringPostProcess", 1, scene.activeCamera, mesh, 100, import_babylonjs4.Texture.BILINEAR_SAMPLINGMODE, scene.getEngine(), false);
  return vlsPostProcess;
}
__name(createVLSPostProcess, "createVLSPostProcess");
function parseVLSPostProcess(scene, data) {
  let mesh = null;
  if (data.meshId) {
    const result = scene.getMeshById(data.meshId);
    if (result && isMesh(result)) {
      mesh = result;
    }
  }
  const vlsPostProcess2 = createVLSPostProcess(scene, mesh);
  vlsPostProcess2.exposure = data.exposure;
  vlsPostProcess2.decay = data.decay;
  vlsPostProcess2.weight = data.weight;
  vlsPostProcess2.density = data.density;
  vlsPostProcess2.invert = data.invert;
  vlsPostProcess2.useCustomMeshPosition = data.useCustomMeshPosition;
  vlsPostProcess2.customMeshPosition.copyFrom(import_babylonjs3.Vector3.FromArray(data.customMeshPosition));
  return vlsPostProcess2;
}
__name(parseVLSPostProcess, "parseVLSPostProcess");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/rendering/ssr.js
var import_babylonjs6 = require("babylonjs");
var ssrRenderingPipeline = null;
var ssrRenderingPipelineCameraConfigurations = /* @__PURE__ */ new Map();
function disposeSSRRenderingPipeline() {
  if (ssrRenderingPipeline) {
    ssrRenderingPipeline.dispose();
    ssrRenderingPipeline = null;
  }
}
__name(disposeSSRRenderingPipeline, "disposeSSRRenderingPipeline");
function createSSRRenderingPipeline(scene, camera) {
  ssrRenderingPipeline = new import_babylonjs6.SSRRenderingPipeline("SSRRenderingPipeline", scene, [camera]);
  ssrRenderingPipeline.samples = 4;
  return ssrRenderingPipeline;
}
__name(createSSRRenderingPipeline, "createSSRRenderingPipeline");
function parseSSRRenderingPipeline(scene, camera, data) {
  if (ssrRenderingPipeline) {
    return ssrRenderingPipeline;
  }
  const pipeline = createSSRRenderingPipeline(scene, camera);
  pipeline.samples = data.samples;
  pipeline.step = data.step;
  pipeline.thickness = data.thickness;
  pipeline.strength = data.strength;
  pipeline.reflectionSpecularFalloffExponent = data.reflectionSpecularFalloffExponent;
  pipeline.maxSteps = data.maxSteps;
  pipeline.maxDistance = data.maxDistance;
  pipeline.roughnessFactor = data.roughnessFactor;
  pipeline.reflectivityThreshold = data.reflectivityThreshold;
  pipeline.blurDispersionStrength = data.blurDispersionStrehgth;
  pipeline.clipToFrustum = data.clipToFrustum;
  pipeline.enableSmoothReflections = data.enableSmoothReflections;
  pipeline.enableAutomaticThicknessComputation = data.enableAutomaticThicknessComputation;
  pipeline.attenuateFacingCamera = data.attenuateFacingCamera;
  pipeline.attenuateScreenBorders = data.attenuateScreenBorders;
  pipeline.attenuateIntersectionDistance = data.attenuateIntersectionDistance;
  pipeline.attenuateBackfaceReflection = data.attenuateBackfaceReflection;
  pipeline.blurDownsample = data.blurDownsample;
  pipeline.selfCollisionNumSkip = data.selfCollisionNumSkip;
  pipeline.ssrDownsample = data.ssrDownsample;
  pipeline.backfaceDepthTextureDownsample = data.backfaceDepthTextureDownsample;
  return pipeline;
}
__name(parseSSRRenderingPipeline, "parseSSRRenderingPipeline");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/rendering/taa.js
var import_babylonjs7 = require("babylonjs");
var taaRenderingPipeline = null;
var taaRenderingPipelineCameraConfigurations = /* @__PURE__ */ new Map();
function disposeTAARenderingPipeline() {
  if (taaRenderingPipeline) {
    taaRenderingPipeline.dispose();
    taaRenderingPipeline = null;
  }
}
__name(disposeTAARenderingPipeline, "disposeTAARenderingPipeline");
function createTAARenderingPipeline(scene, camera) {
  taaRenderingPipeline = new import_babylonjs7.TAARenderingPipeline("TAARenderingPipeline", scene, [camera]);
  taaRenderingPipeline.samples = 4;
  return taaRenderingPipeline;
}
__name(createTAARenderingPipeline, "createTAARenderingPipeline");
function parseTAARenderingPipeline(scene, camera, data) {
  if (taaRenderingPipeline) {
    return taaRenderingPipeline;
  }
  const pipeline = createTAARenderingPipeline(scene, camera);
  pipeline.factor = data.factor;
  pipeline.samples = data.samples;
  pipeline.clampHistory = data.clampHistory;
  pipeline.reprojectHistory = data.reprojectHistory;
  pipeline.disableOnCameraMove = data.disableOnCameraMove;
  return pipeline;
}
__name(parseTAARenderingPipeline, "parseTAARenderingPipeline");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/rendering/ssao.js
var import_babylonjs8 = require("babylonjs");
var ssaoRenderingPipeline = null;
var ssaoRenderingPipelineCameraConfigurations = /* @__PURE__ */ new Map();
function disposeSSAO2RenderingPipeline() {
  if (ssaoRenderingPipeline) {
    ssaoRenderingPipeline.dispose();
    ssaoRenderingPipeline = null;
  }
}
__name(disposeSSAO2RenderingPipeline, "disposeSSAO2RenderingPipeline");
function createSSAO2RenderingPipeline(scene, camera) {
  ssaoRenderingPipeline = new import_babylonjs8.SSAO2RenderingPipeline("SSAO2RenderingPipeline", scene, 1, [camera]);
  ssaoRenderingPipeline.samples = 4;
  return ssaoRenderingPipeline;
}
__name(createSSAO2RenderingPipeline, "createSSAO2RenderingPipeline");
function parseSSAO2RenderingPipeline(scene, camera, data) {
  if (ssaoRenderingPipeline) {
    return ssaoRenderingPipeline;
  }
  const pipeline = createSSAO2RenderingPipeline(scene, camera);
  pipeline.radius = data.radius;
  pipeline.totalStrength = data.totalStrength;
  pipeline.samples = data.samples;
  pipeline.maxZ = data.maxZ;
  pipeline.minZAspect = data.minZAspect;
  pipeline.epsilon = data.epsilon;
  pipeline.textureSamples = data.textureSamples;
  pipeline.bypassBlur = data.bypassBlur;
  pipeline.bilateralSamples = data.bilateralSamples;
  pipeline.bilateralSoften = data.bilateralSoften;
  pipeline.bilateralTolerance = data.bilateralTolerance;
  pipeline.expensiveBlur = data.expensiveBlur;
  return pipeline;
}
__name(parseSSAO2RenderingPipeline, "parseSSAO2RenderingPipeline");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/rendering/motion-blur.js
var import_babylonjs9 = require("babylonjs");
var motionBlurPostProcess = null;
var motionBlurPostProcessCameraConfigurations = /* @__PURE__ */ new Map();
function disposeMotionBlurPostProcess() {
  if (motionBlurPostProcess) {
    motionBlurPostProcess.dispose();
    motionBlurPostProcess = null;
  }
}
__name(disposeMotionBlurPostProcess, "disposeMotionBlurPostProcess");
function createMotionBlurPostProcess(scene, camera) {
  motionBlurPostProcess = new import_babylonjs9.MotionBlurPostProcess("MotionBlurPostProcess", scene, 1, camera);
  motionBlurPostProcess.motionStrength = 1;
  motionBlurPostProcess.isObjectBased = true;
  return motionBlurPostProcess;
}
__name(createMotionBlurPostProcess, "createMotionBlurPostProcess");
function parseMotionBlurPostProcess(scene, camera, data) {
  if (motionBlurPostProcess) {
    return motionBlurPostProcess;
  }
  const postProcess = createMotionBlurPostProcess(scene, camera);
  postProcess.isObjectBased = data.isObjectBased;
  postProcess.motionStrength = data.motionStrength;
  postProcess.motionBlurSamples = data.motionBlurSamples;
  return postProcess;
}
__name(parseMotionBlurPostProcess, "parseMotionBlurPostProcess");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/rendering/default-pipeline.js
var import_babylonjs10 = require("babylonjs");
var import_babylonjs11 = require("babylonjs");
var import_babylonjs12 = require("babylonjs");
var import_babylonjs13 = require("babylonjs");
var import_babylonjs14 = require("babylonjs");
var defaultRenderingPipeline = null;
var defaultPipelineCameraConfigurations = /* @__PURE__ */ new Map();
function disposeDefaultRenderingPipeline() {
  if (defaultRenderingPipeline) {
    defaultRenderingPipeline.dispose();
    defaultRenderingPipeline = null;
  }
}
__name(disposeDefaultRenderingPipeline, "disposeDefaultRenderingPipeline");
function createDefaultRenderingPipeline(scene, camera) {
  defaultRenderingPipeline = new import_babylonjs14.DefaultRenderingPipeline("DefaultRenderingPipeline", true, scene, [camera]);
  defaultRenderingPipeline.samples = 4;
  defaultRenderingPipeline.depthOfField.lensSize = 512;
  defaultRenderingPipeline.depthOfField.fStop = 0.25;
  defaultRenderingPipeline.depthOfField.focusDistance = 55e3;
  return defaultRenderingPipeline;
}
__name(createDefaultRenderingPipeline, "createDefaultRenderingPipeline");
function parseDefaultRenderingPipeline(scene, camera, data, rootUrl) {
  if (defaultRenderingPipeline) {
    return defaultRenderingPipeline;
  }
  const pipeline = createDefaultRenderingPipeline(scene, camera);
  pipeline.samples = data.samples;
  pipeline.fxaaEnabled = data.fxaaEnabled;
  pipeline.imageProcessingEnabled = data.imageProcessingEnabled;
  if (pipeline.imageProcessing) {
    pipeline.imageProcessing.exposure = data.exposure;
    pipeline.imageProcessing.contrast = data.contrast;
    pipeline.imageProcessing.fromLinearSpace = data.fromLinearSpace;
    pipeline.imageProcessing.toneMappingEnabled = data.toneMappingEnabled;
    pipeline.imageProcessing.toneMappingType = data.toneMappingType;
    pipeline.imageProcessing.ditheringEnabled = data.ditheringEnabled;
    pipeline.imageProcessing.ditheringIntensity = data.ditheringIntensity;
    pipeline.imageProcessing.vignetteEnabled = data.vignetteEnabled ?? false;
    pipeline.imageProcessing.vignetteColor = import_babylonjs10.Color4.FromArray(data.vignetteColor ?? [0, 0, 0]);
    pipeline.imageProcessing.vignetteWeight = data.vignetteWeight ?? 0.3;
    pipeline.imageProcessing.colorGradingEnabled = data.colorGradingEnabled ?? false;
    pipeline.imageProcessing.imageProcessingConfiguration.colorGradingWithGreenDepth = data.colorGradingWithGreenDepth ?? true;
    if (data.colorGradingTexture) {
      let texture = null;
      if (data.colorGradingTexture.customType === "BABYLON.ColorGradingTexture") {
        const absoluteUrl = rootUrl + data.colorGradingTexture.name;
        texture = new import_babylonjs13.ColorGradingTexture(absoluteUrl, scene);
        texture.level = data.colorGradingTexture.level;
      } else {
        const parsedTexture = import_babylonjs12.Texture.Parse(data.colorGradingTexture, scene, rootUrl);
        if (isTexture(parsedTexture)) {
          texture = parsedTexture;
        }
      }
      pipeline.imageProcessing.colorGradingTexture = texture;
    }
    pipeline.imageProcessing.colorCurvesEnabled = data.colorCurvesEnabled ?? false;
    if (pipeline.imageProcessing.colorCurves) {
      pipeline.imageProcessing.colorCurves.globalHue = data.globalHue ?? 30;
      pipeline.imageProcessing.colorCurves.globalDensity = data.globalDensity ?? 0;
      pipeline.imageProcessing.colorCurves.globalExposure = data.globalExposure ?? 0;
      pipeline.imageProcessing.colorCurves.globalSaturation = data.globalSaturation ?? 0;
      pipeline.imageProcessing.colorCurves.highlightsHue = data.highlightsHue ?? 30;
      pipeline.imageProcessing.colorCurves.highlightsDensity = data.highlightsDensity ?? 0;
      pipeline.imageProcessing.colorCurves.highlightsExposure = data.highlightsExposure ?? 0;
      pipeline.imageProcessing.colorCurves.highlightsSaturation = data.highlightsSaturation ?? 0;
      pipeline.imageProcessing.colorCurves.midtonesHue = data.midtonesHue ?? 30;
      pipeline.imageProcessing.colorCurves.midtonesDensity = data.midtonesDensity ?? 0;
      pipeline.imageProcessing.colorCurves.midtonesExposure = data.midtonesExposure ?? 0;
      pipeline.imageProcessing.colorCurves.midtonesSaturation = data.midtonesSaturation ?? 0;
      pipeline.imageProcessing.colorCurves.shadowsHue = data.shadowsHue ?? 30;
      pipeline.imageProcessing.colorCurves.shadowsDensity = data.shadowsDensity ?? 0;
      pipeline.imageProcessing.colorCurves.shadowsExposure = data.shadowsExposure ?? 0;
      pipeline.imageProcessing.colorCurves.shadowsSaturation = data.shadowsSaturation ?? 0;
    }
  }
  pipeline.bloomEnabled = data.bloomEnabled;
  pipeline.bloomThreshold = data.bloomThreshold;
  pipeline.bloomWeight = data.bloomWeight;
  pipeline.bloomScale = data.bloomScale;
  pipeline.bloomKernel = data.bloomKernel;
  pipeline.sharpenEnabled = data.sharpenEnabled;
  pipeline.sharpen.edgeAmount = data.sharpenEdgeAmount;
  pipeline.sharpen.colorAmount = data.sharpenColorAmount;
  pipeline.grainEnabled = data.grainEnabled;
  pipeline.grain.intensity = data.grainIntensity;
  pipeline.grain.animated = data.grainAnimated;
  pipeline.depthOfFieldEnabled = data.depthOfFieldEnabled;
  pipeline.depthOfFieldBlurLevel = data.depthOfFieldBlurLevel;
  pipeline.depthOfField.lensSize = data.lensSize;
  pipeline.depthOfField.fStop = data.fStop;
  pipeline.depthOfField.focusDistance = data.focusDistance;
  pipeline.depthOfField.focalLength = data.focalLength;
  pipeline.chromaticAberrationEnabled = data.chromaticAberrationEnabled ?? false;
  pipeline.chromaticAberration.aberrationAmount = data.aberrationAmount ?? 10;
  pipeline.chromaticAberration.radialIntensity = data.radialIntensity ?? 1;
  pipeline.chromaticAberration.direction = import_babylonjs11.Vector2.FromArray(data.direction ?? [0, 0]);
  pipeline.chromaticAberration.centerPosition = import_babylonjs11.Vector2.FromArray(data.centerPosition ?? [0, 0]);
  pipeline.glowLayerEnabled = data.glowLayerEnabled ?? false;
  if (pipeline.glowLayer) {
    pipeline.glowLayer.intensity = data.glowLayerIntensity ?? 1;
    pipeline.glowLayer.blurKernelSize = data.glowLayerBlurKernelSize ?? 32;
  }
  return pipeline;
}
__name(parseDefaultRenderingPipeline, "parseDefaultRenderingPipeline");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/rendering/tools.js
function applyRenderingConfigurationForCamera(camera, rootUrl, options) {
  disposeSSAO2RenderingPipeline();
  disposeVLSPostProcess(camera.getScene());
  disposeSSRRenderingPipeline();
  disposeMotionBlurPostProcess();
  disposeDefaultRenderingPipeline();
  disposeTAARenderingPipeline();
  const ssao2RenderingPipeline = ssaoRenderingPipelineCameraConfigurations.get(camera);
  if (ssao2RenderingPipeline && !options?.ssao2Disabled) {
    parseSSAO2RenderingPipeline(camera.getScene(), camera, ssao2RenderingPipeline);
  }
  const vlsPostProcess2 = vlsPostProcessCameraConfigurations.get(camera);
  if (vlsPostProcess2 && !options?.vlsDisabled) {
    parseVLSPostProcess(camera.getScene(), vlsPostProcess2);
  }
  const ssrRenderingPipeline2 = ssrRenderingPipelineCameraConfigurations.get(camera);
  if (ssrRenderingPipeline2 && !options?.ssrDisabled) {
    parseSSRRenderingPipeline(camera.getScene(), camera, ssrRenderingPipeline2);
  }
  const motionBlurPostProcess2 = motionBlurPostProcessCameraConfigurations.get(camera);
  if (motionBlurPostProcess2 && !options?.motionBlurDisabled) {
    parseMotionBlurPostProcess(camera.getScene(), camera, motionBlurPostProcess2);
  }
  const defaultRenderingPipeline2 = defaultPipelineCameraConfigurations.get(camera);
  if (defaultRenderingPipeline2 && !options?.defaultPipelineDisabled) {
    parseDefaultRenderingPipeline(camera.getScene(), camera, defaultRenderingPipeline2, rootUrl);
  }
  const taaRenderingPipeline2 = taaRenderingPipelineCameraConfigurations.get(camera);
  if (taaRenderingPipeline2 && !options?.taaDisabled) {
    parseTAARenderingPipeline(camera.getScene(), camera, taaRenderingPipeline2);
  }
}
__name(applyRenderingConfigurationForCamera, "applyRenderingConfigurationForCamera");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/loading/physics.js
var import_babylonjs15 = require("babylonjs");
var import_babylonjs16 = require("babylonjs");
function configurePhysicsAggregate(transformNode) {
  const data = transformNode.metadata?.physicsAggregate;
  if (!data) {
    return;
  }
  let mesh = void 0;
  if (isMesh(transformNode)) {
    mesh = transformNode;
  } else if (isInstancedMesh(transformNode)) {
    mesh = transformNode.sourceMesh;
  }
  const aggregate = new import_babylonjs16.PhysicsAggregate(transformNode, data.shape.type, {
    mesh,
    mass: data.massProperties.mass
  });
  aggregate.body.setMassProperties({
    mass: data.massProperties.mass,
    inertia: data.massProperties.inertia ? import_babylonjs15.Vector3.FromArray(data.massProperties.inertia) : void 0,
    centerOfMass: data.massProperties.centerOfMass ? import_babylonjs15.Vector3.FromArray(data.massProperties.centerOfMass) : void 0,
    inertiaOrientation: data.massProperties.inertiaOrientation ? import_babylonjs15.Quaternion.FromArray(data.massProperties.inertiaOrientation) : void 0
  });
  aggregate.shape.density = data.shape.density;
  aggregate.body.setMotionType(data.body.motionType);
  aggregate.shape.material = data.material;
  transformNode.physicsAggregate = aggregate;
  transformNode.metadata.physicsAggregate = void 0;
}
__name(configurePhysicsAggregate, "configurePhysicsAggregate");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/loading/rendering.js
function applyRenderingConfigurations(scene, rendering) {
  const postProcessConfigurations = Array.isArray(rendering) ? rendering : [];
  postProcessConfigurations.forEach((configuration) => {
    const camera = scene.getCameraById(configuration.cameraId);
    if (!camera) {
      return;
    }
    if (configuration.ssao2RenderingPipeline) {
      ssaoRenderingPipelineCameraConfigurations.set(camera, configuration.ssao2RenderingPipeline);
    }
    if (configuration.vlsPostProcess) {
      vlsPostProcessCameraConfigurations.set(camera, configuration.vlsPostProcess);
    }
    if (configuration.ssrRenderingPipeline) {
      ssrRenderingPipelineCameraConfigurations.set(camera, configuration.ssrRenderingPipeline);
    }
    if (configuration.motionBlurPostProcess) {
      motionBlurPostProcessCameraConfigurations.set(camera, configuration.motionBlurPostProcess);
    }
    if (configuration.defaultRenderingPipeline) {
      defaultPipelineCameraConfigurations.set(camera, configuration.defaultRenderingPipeline);
    }
    if (configuration.taaRenderingPipeline) {
      taaRenderingPipelineCameraConfigurations.set(camera, configuration.taaRenderingPipeline);
    }
  });
}
__name(applyRenderingConfigurations, "applyRenderingConfigurations");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/decorators/apply.js
var import_babylonjs28 = require("babylonjs");
var import_babylonjs29 = require("babylonjs");
var import_babylonjs30 = require("babylonjs");
var import_babylonjs31 = require("babylonjs");
var import_babylonjs32 = require("babylonjs");
var import_babylonjs_gui = require("babylonjs-gui");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/tools/request.js
var import_babylonjs17 = require("babylonjs");
function loadFile(url, responseType, progressCallback) {
  return new Promise((resolve, reject) => {
    const request = new import_babylonjs17.WebRequest();
    request.open("GET", url);
    request.responseType = responseType;
    request.send();
    request.addEventListener("progress", (ev) => {
      progressCallback?.({
        total: ev.total,
        loaded: ev.loaded
      });
    });
    request.addEventListener("load", () => {
      resolve(responseType === "text" ? request.responseText : request.response);
    });
    request.addEventListener("error", (e) => reject(e));
  });
}
__name(loadFile, "loadFile");
async function loadJsonFile(url, progressCallback) {
  const response = await loadFile(url, "text", progressCallback);
  return JSON.parse(response);
}
__name(loadJsonFile, "loadJsonFile");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/tools/scene.js
function getNodeByName(name, scene) {
  const node = scene.getNodeByName(name);
  if (node) {
    return node;
  }
  const clusteredLightContainers = scene.lights.filter((light) => isClusteredLightContainer(light));
  for (const clusteredLightContainer of clusteredLightContainers) {
    const lightNode = clusteredLightContainer.lights.find((light) => light.name === name);
    if (lightNode) {
      return lightNode;
    }
  }
  return null;
}
__name(getNodeByName, "getNodeByName");
function getNodeById(id, scene) {
  const node = scene.getNodeById(id);
  if (node) {
    return node;
  }
  const clusteredLightContainers = scene.lights.filter((light) => isClusteredLightContainer(light));
  for (const clusteredLightContainer of clusteredLightContainers) {
    const lightNode = clusteredLightContainer.lights.find((light) => light.id === id);
    if (lightNode) {
      return lightNode;
    }
  }
  return null;
}
__name(getNodeById, "getNodeById");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/tools/vector.js
var import_babylonjs18 = require("babylonjs");
var import_babylonjs19 = require("babylonjs");
function parseAxis(axis) {
  const vector = import_babylonjs19.Vector3.FromArray(axis);
  if (vector.equals(import_babylonjs18.Axis.X)) {
    return import_babylonjs18.Axis.X;
  }
  if (vector.equals(import_babylonjs18.Axis.Y)) {
    return import_babylonjs18.Axis.Y;
  }
  if (vector.equals(import_babylonjs18.Axis.Z)) {
    return import_babylonjs18.Axis.Z;
  }
  return vector;
}
__name(parseAxis, "parseAxis");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/tools/ragdoll.js
function parseRagdollConfiguration(configuration) {
  configuration.runtimeConfiguration.forEach((config) => {
    if (config.rotationAxis) {
      config.rotationAxis = parseAxis(config.rotationAxis);
    }
    if (config.boneOffsetAxis) {
      config.boneOffsetAxis = parseAxis(config.boneOffsetAxis);
    }
  });
  return configuration;
}
__name(parseRagdollConfiguration, "parseRagdollConfiguration");
function copyAndParseRagdollConfiguration(configuration) {
  const copy = {
    rootNodeId: configuration.rootNodeId,
    skeletonName: configuration.skeletonName,
    scalingFactor: configuration.scalingFactor,
    runtimeConfiguration: configuration.runtimeConfiguration.map((config) => ({
      name: config.name,
      bones: config.bones,
      width: config.width,
      depth: config.depth,
      height: config.height,
      size: config.size,
      joint: config.joint,
      min: config.min,
      max: config.max,
      boxOffset: config.boxOffset,
      rotationAxis: config.rotationAxis?.slice(),
      boneOffsetAxis: config.boneOffsetAxis?.slice()
    }))
  };
  return parseRagdollConfiguration(copy);
}
__name(copyAndParseRagdollConfiguration, "copyAndParseRagdollConfiguration");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/loading/container/container.js
var import_babylonjs25 = require("babylonjs");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/tools/tools.js
function cloneJSObject(source) {
  if (!source) {
    return source;
  }
  return JSON.parse(JSON.stringify(source));
}
__name(cloneJSObject, "cloneJSObject");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/loading/sound.js
var import_babylonjs20 = require("babylonjs");
var import_babylonjs21 = require("babylonjs");
var import_babylonjs22 = require("babylonjs");
var import_babylonjs23 = require("babylonjs");
var import_babylonjs24 = require("babylonjs");
var registered = false;
var registeredUpdateObserver = null;
var soundInstances = [];
var cachedSoundBuffers = /* @__PURE__ */ new Map();
function createSoundInstance(name, options) {
  const audioEngine = (0, import_babylonjs24._GetAudioEngine)(null);
  return new import_babylonjs23._WebAudioStaticSound(name, audioEngine, options);
}
__name(createSoundInstance, "createSoundInstance");
function registerUpdateSoundsObserver(scene) {
  registeredUpdateObserver?.remove();
  if (!soundInstances.length) {
    return;
  }
  registeredUpdateObserver = scene.onBeforeRenderObservable.add(() => {
    soundInstances.forEach((instance) => {
      if (instance.isEnabled(false) && instance.autoUpdateSpatial && instance.sound?._isSpatial && instance.isPlaying() && scene.activeCamera) {
        instance.sound.spatial.update();
      }
    });
  });
}
__name(registerUpdateSoundsObserver, "registerUpdateSoundsObserver");
function registerSoundNodeEvents(instance) {
  instance.sound?.onDisposeObservable.addOnce(() => {
    const index = soundInstances.indexOf(instance);
    if (index !== -1) {
      soundInstances.splice(index, 1);
    }
  });
  instance.onDisposeObservable.addOnce(() => {
    instance.sound?.dispose();
  });
}
__name(registerSoundNodeEvents, "registerSoundNodeEvents");
function loadSoundBuffer(scene, soundAbsolutePath) {
  return new Promise(async (resolve, reject) => {
    if (!scene.offlineProvider || !import_babylonjs20.Database.IDBStorageEnabled) {
      return (0, import_babylonjs24.CreateSoundBufferAsync)(soundAbsolutePath).then((buffer) => resolve(buffer)).catch((e) => reject(e));
    }
    scene.offlineProvider.loadFile(soundAbsolutePath, (data) => {
      (0, import_babylonjs24.CreateSoundBufferAsync)(data).then((buffer) => resolve(buffer)).catch((e) => reject(e));
    }, void 0, () => {
      reject(null);
    }, true);
  });
}
__name(loadSoundBuffer, "loadSoundBuffer");
function configureSourceNodeFrom(source, target) {
  if (!source.soundRelativePath || !source.sound) {
    return;
  }
  const sound = createSoundInstance(source.soundRelativePath, {
    spatialAutoUpdate: false
  });
  sound._initAsync(source.sound.buffer, {
    spatialAutoUpdate: false
  }).then(() => {
    sound.volume = source.volume;
    sound._isSpatial = source.sound._isSpatial;
    if (sound._isSpatial) {
      sound.spatial.attach(target);
      sound.spatial.maxDistance = source.sound.spatial.maxDistance;
      sound.spatial.panningModel = source.sound.spatial.panningModel;
      sound.spatial.distanceModel = source.sound.spatial.distanceModel;
    }
    target.sound = sound;
    target.isSoundNode = true;
    target.soundRelativePath = source.soundRelativePath;
    target.autoUpdateSpatial = source.autoUpdateSpatial;
    soundInstances.push(target);
    registerUpdateSoundsObserver(target.getScene());
  });
  registerSoundNodeEvents(target);
  configureSoundNodePrototype(target, sound);
}
__name(configureSourceNodeFrom, "configureSourceNodeFrom");
function configureSoundNodePrototype(instance, sound) {
  Object.defineProperty(instance, "volume", {
    get: /* @__PURE__ */ __name(() => {
      return sound.volume;
    }, "get"),
    set: /* @__PURE__ */ __name((volume) => {
      sound.volume = volume;
    }, "set")
  });
  Object.defineProperty(instance, "playbackRate", {
    get: /* @__PURE__ */ __name(() => {
      return sound.playbackRate;
    }, "get"),
    set: /* @__PURE__ */ __name((playbackRate) => {
      sound.playbackRate = playbackRate;
    }, "set")
  });
  instance.isPaused = () => sound.state === import_babylonjs21.SoundState.Paused;
  instance.isPlaying = () => sound.state === import_babylonjs21.SoundState.Started;
  instance.isStopped = () => sound.state === import_babylonjs21.SoundState.Stopped;
  instance.pause = () => sound.pause();
  instance.resume = () => sound.resume();
  instance.stop = (options) => sound.stop(options);
  instance.play = (options) => sound.play(options);
  instance.setVolume = (volume, options) => sound.setVolume(volume, options);
  instance.attachTo = (node, useBoundingBox, attachmentType) => sound.spatial.attach(node, useBoundingBox, attachmentType);
}
__name(configureSoundNodePrototype, "configureSoundNodePrototype");
function registerAudioParser() {
  if (registered) {
    return;
  }
  registered = true;
  (0, import_babylonjs22.AddParser)("SoundNode", (parsedData, scene, container, rootUrl) => {
    parsedData.transformNodes?.forEach((transformNode) => {
      if (!transformNode.isSoundNode) {
        return;
      }
      const instance = container.transformNodes?.find((t) => t.id === transformNode.id);
      if (!instance) {
        return;
      }
      if (transformNode.soundRelativePath) {
        const soundAbsolutePath = `${rootUrl}${transformNode.soundRelativePath}`;
        scene.addPendingData(soundAbsolutePath);
        if (!cachedSoundBuffers.has(soundAbsolutePath)) {
          cachedSoundBuffers.set(soundAbsolutePath, loadSoundBuffer(scene, soundAbsolutePath));
        }
        const promise = cachedSoundBuffers.get(soundAbsolutePath);
        promise.then((buffer) => {
          (0, import_babylonjs24.CreateSoundAsync)(transformNode.soundRelativePath, buffer, {
            spatialAutoUpdate: false
          }).then((sound) => {
            scene.removePendingData(soundAbsolutePath);
            if (instance.isDisposed()) {
              return sound.dispose();
            }
            sound.volume = transformNode.volume;
            sound._isSpatial = transformNode.isSpatial;
            if (transformNode.isSpatial) {
              sound.spatial.attach(instance);
              sound.spatial.maxDistance = transformNode.maxDistance;
              sound.spatial.panningModel = transformNode.panningModel;
              sound.spatial.distanceModel = transformNode.distanceModel;
            }
            instance.sound = sound;
            instance.isSoundNode = true;
            instance.soundRelativePath = transformNode.soundRelativePath;
            instance.autoUpdateSpatial = transformNode.autoUpdateSpatial;
            soundInstances.push(instance);
            registerSoundNodeEvents(instance);
            configureSoundNodePrototype(instance, sound);
            registerUpdateSoundsObserver(scene);
          });
        });
      }
    });
  });
}
__name(registerAudioParser, "registerAudioParser");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/loading/transform-node.js
function configureTransformNodes(scene) {
  const computedMaterials = /* @__PURE__ */ new Set();
  scene.transformNodes.forEach((transformNode) => {
    if (transformNode.metadata?.isStaticGroup) {
      const descendants = transformNode.getDescendants(false);
      descendants.push(transformNode);
      descendants.forEach((node) => {
        if (isAbstractMesh(node) || isTransformNode(node) && !node.isWorldMatrixFrozen) {
          node.freezeWorldMatrix();
        }
        if (isAbstractMesh(node)) {
          const material = node.material;
          if (material && !material.isFrozen && !computedMaterials.has(material)) {
            computedMaterials.add(material);
            material.onBindObservable.addOnce(() => {
              material.freeze();
            });
          }
        }
      });
    }
  });
}
__name(configureTransformNodes, "configureTransformNodes");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/loading/container/entries.js
var AdvancedAssetContainerInstantiatedEntries = class {
  static {
    __name(this, "AdvancedAssetContainerInstantiatedEntries");
  }
  entries;
  namingId;
  constructor(entries, namingId) {
    this.entries = entries;
    this.namingId = namingId;
  }
  /**
   * Returns the list of root nodes of the instantiated container.
   */
  get rootNodes() {
    return this.entries.rootNodes;
  }
  /**
   * Returns the list of all nodes of the instantiated container.
   */
  get skeletons() {
    return this.entries.skeletons;
  }
  /**
   * Returns the list of all animation groups of the instantiated container.
   */
  get animationGroups() {
    return this.entries.animationGroups;
  }
  /**
   * Disposes all the instantiated entries (meshes, skeletons, animation groups)
   */
  dispose() {
    this.entries.dispose();
  }
  /**
   * Retrieve the reference to a root node of the instantiated container by its name.
   * @param name defines the name of the root node to retrieve.
   * @returns the reference to the root node of the instantiated container which matches the given name, or null if not found.
   */
  getRootNodeByName(name) {
    const effectiveName = `${name}-${this.namingId}`;
    return this.entries.rootNodes.find((node) => node.name === effectiveName) ?? null;
  }
  /**
   * Retrieve the reference to a node present in the instantiated container by its name recursively.
   * @param name defines the name of the node to retrieve.
   * @returns the reference to the node of the instantiated container which matches the given name, or null if not found.
   */
  getNodeByName(name) {
    const effectiveName = `${name}-${this.namingId}`;
    for (const node of this.entries.rootNodes) {
      const result = this._recursivelyGetNodeByName(effectiveName, node);
      if (result) {
        return result;
      }
    }
    return null;
  }
  _recursivelyGetNodeByName(name, root) {
    if (root.name === name) {
      return root;
    }
    for (const child of root.getDescendants(true)) {
      const result = this._recursivelyGetNodeByName(name, child);
      if (result) {
        return result;
      }
    }
    return null;
  }
  /**
   * Retrieve the reference to a script instance of the given type attached to a node with the given name.
   * @param name defines the name of the object to retrieve the script from.
   * @param classType defines the class of the type to retrieve.
   * @returns the reference to the script instance attached to the node which matches the given class type.
   */
  getScriptByClassByObjectName(name, classType) {
    const node = this.getNodeByName(name);
    if (node) {
      const scripts = getAllScriptsByClassForObject(node, classType);
      if (scripts?.length === 1) {
        return scripts[0];
      }
    }
    return null;
  }
};

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/loading/container/container.js
var AdvancedAssetContainer = class {
  static {
    __name(this, "AdvancedAssetContainer");
  }
  /**
   * Defines the reference to the
   */
  container;
  _rootUrl;
  _scriptsMap;
  _originalDescendants = [];
  _nodesMap = /* @__PURE__ */ new Map();
  _animationGroupsMap = /* @__PURE__ */ new Map();
  constructor(container, rootUrl, scriptsMap2) {
    this.container = container;
    this._rootUrl = rootUrl;
    this._scriptsMap = scriptsMap2;
    container.populateRootNodes();
    container.rootNodes.forEach((node) => {
      this._originalDescendants.push(node, ...node.getDescendants(false));
    });
    container.animationGroups.forEach((animationGroup) => {
      this._animationGroupsMap.set(animationGroup.name, animationGroup);
    });
    this._originalDescendants.forEach((node) => {
      this._nodesMap.set(node, {
        node,
        metadata: cloneJSObject(node.metadata)
      });
    });
  }
  /**
   * By default, loaded advanced asset containers add their nodes in the scene.
   * As it is not always wanted, this method allows to remove those nodes from the scene and only keep them in the container.
   * This is particularely useful when you want to instantiate the container several times in the scene, but not use the original nodes of the container itself.
   */
  removeDefault() {
    this.container.getNodes().forEach((node) => {
      const scripts = scriptsDictionary.get(node);
      scripts?.forEach((script) => {
        _removeRegisteredScriptInstance(node, script);
      });
    });
    this.container.removeAllFromScene();
  }
  /**
   * Retrieve the reference to a node present in the root nodes of the container by its name.
   * This is useful only if the container is not intended to be instantiated so you never call `.removeDefault()`.
   * @param name defines the name of the root node to retrieve.
   */
  getRootNodeByName(name) {
    return this.container.rootNodes.find((node) => node.name === name) ?? null;
  }
  /**
   * Retrieve the reference to a script instance of the given type attached to a node with the given name.
   * @param name defines the name of the object to retrieve the script from.
   * @param classType defines the class of the type to retrieve.
   * @returns the reference to the script instance attached to the node which matches the given class type.
   */
  getScriptByClassByObjectName(name, classType) {
    const nodes = this.container.getNodes();
    for (const node of nodes) {
      if (node.name === name) {
        const scripts = getAllScriptsByClassForObject(node, classType);
        if (scripts?.length === 1) {
          return scripts[0];
        }
      }
    }
    return null;
  }
  /**
   * Instantiate or clone all meshes, skeletons and animations groups, and add the new ones to the scene.
   * If the container contains scripts attached to its nodes, those scripts will also be applied on the instantiated/cloned nodes.
   * @param options defines an optional list of options to control how to instantiate / clone models
   * @param options.doNotInstantiate defines if the model must be instantiated or just cloned
   * @param options.predicate defines a predicate used to filter whih mesh to instantiate/clone
   * @returns a new reference to instantiated entries with the instantiated nodes, skeletons and animation groups.
   * @see `BABYLON.AssetContainer.instantiateModelsToScene` for options.
   */
  instantiate(options) {
    const namingId = import_babylonjs25.Tools.RandomId();
    const nameFunction = /* @__PURE__ */ __name((sourceName) => sourceName, "nameFunction");
    const entries = this.container.instantiateModelsToScene(nameFunction, false, {
      ...options,
      predicate: /* @__PURE__ */ __name((entity) => {
        entity.name = `${entity.name}@editor-tools@${namingId}_${entity.id}`;
        return options?.predicate?.(entity) ?? true;
      }, "predicate")
    });
    const result = new AdvancedAssetContainerInstantiatedEntries(entries, namingId);
    const allContainerEntries = [
      ...this.container.transformNodes,
      ...this.container.meshes,
      ...this.container.lights,
      ...this.container.cameras,
      ...this.container.animationGroups,
      ...this.container.skeletons
    ];
    allContainerEntries.forEach((entry) => {
      const nameSplit = entry.name.split("@editor-tools@");
      entry.name = nameSplit[0];
    });
    entries.animationGroups.forEach((animationGroup) => {
      const nameSplit = animationGroup.name.split("@editor-tools@");
      animationGroup.name = `${nameSplit[0]}-${namingId}`;
    });
    const newDescendants = [];
    entries.rootNodes.forEach((node) => {
      newDescendants.push(node, ...node.getDescendants(false));
    });
    newDescendants.forEach((newNode) => {
      const nameSplit = newNode.name.split("@editor-tools@");
      const originalId = nameSplit[1].split("_").pop();
      newNode.name = `${nameSplit[0]}-${namingId}`;
      const originalNode = this._originalDescendants.find((n) => n.id === originalId);
      if (isSoundNode(originalNode) && isTransformNode(newNode)) {
        configureSourceNodeFrom(originalNode, newNode);
      }
      newNode.id = import_babylonjs25.Tools.RandomId();
      newNode.metadata = cloneJSObject(this._nodesMap.get(originalNode).metadata);
      newNode.metadata ??= {};
      newNode.metadata.originalId = originalId;
      newDescendants.forEach((node) => {
        node.metadata.scripts?.forEach((script) => {
          const valueKeys = Object.keys(script.values || {});
          valueKeys.forEach((key) => {
            const obj = script.values[key];
            if (obj.type === "entity") {
              if (obj.value === originalId) {
                obj.value = newNode.id;
              }
              if (obj.value === originalNode.name) {
                obj.value = newNode.name;
              }
              const originalAnimationGroup = this._animationGroupsMap.get(obj.value);
              if (originalAnimationGroup) {
                obj.value = `${originalAnimationGroup.name}-${namingId}`;
              }
            }
          });
        });
      });
    });
    newDescendants.forEach((node) => {
      _applyScriptsForObject(this.container.scene, node, this._scriptsMap, this._rootUrl);
    });
    configureTransformNodes(this.container.scene);
    return result;
  }
};

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/loading/script/preload/scene.js
var import_babylonjs26 = require("babylonjs");
var import_babylonjs27 = require("babylonjs");
async function preloadSceneScriptAsset(key, rootUrl, scene) {
  const iblIntensity = scene.environmentIntensity;
  const filename = key.split("/").pop();
  const sceneFilename = filename.replace(".scene", ".babylon");
  const container = await (0, import_babylonjs27.LoadAssetContainerAsync)(sceneFilename, scene, {
    rootUrl,
    pluginExtension: ".babylon"
  });
  if (import_babylonjs26.SceneLoaderFlags.ForceFullSceneLoadingForIncremental) {
    scene.meshes.forEach((m) => isMesh(m) && m._checkDelayState());
  }
  container.addAllToScene();
  scene.iblIntensity = iblIntensity;
  configureTransformNodes(scene);
  return container;
}
__name(preloadSceneScriptAsset, "preloadSceneScriptAsset");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/loading/script/preload/common.js
async function preloadCommonScriptAsset(key, rootUrl) {
  return loadJsonFile(`${rootUrl}${key}`);
}
__name(preloadCommonScriptAsset, "preloadCommonScriptAsset");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/loading/script/preload.js
var scriptAssetsCache = /* @__PURE__ */ new Map();
var scriptAssetsParsers = /* @__PURE__ */ new Map();
async function _preloadScriptsAssets(rootUrl, scene, scriptsMap2) {
  const nodes = [scene, ...scene.transformNodes, ...scene.meshes, ...scene.lights, ...scene.cameras];
  const scriptNodes = nodes.filter((node) => node.metadata?.scripts?.length).map((node) => node.metadata.scripts).flat();
  scriptNodes.forEach((script) => {
    const ctor = scriptsMap2[script.key]?.default;
    ctor?._SceneAssets?.forEach((asset) => {
      if (!scriptAssetsCache.get(asset.sceneName)) {
        scriptAssetsCache.set(asset.sceneName, null);
      }
    });
    if (script.values) {
      for (const key in script.values) {
        if (!script.values.hasOwnProperty(key)) {
          continue;
        }
        const obj = script.values[key];
        if (obj.type === "asset" && obj.value && !scriptAssetsCache.get(obj.value)) {
          scriptAssetsCache.set(obj.value, null);
        }
      }
    }
  });
  let loadedAssetsCount = 0;
  for (const value of scriptAssetsCache.values()) {
    if (value === null) {
      ++loadedAssetsCount;
    }
  }
  if (loadedAssetsCount === 0) {
    return loadedAssetsCount;
  }
  const promises = [];
  scriptAssetsCache.forEach((_, key) => {
    if (scriptAssetsCache.get(key)) {
      return;
    }
    promises.push(new Promise(async (resolve) => {
      try {
        const extension = key.split(".").pop();
        switch (extension) {
          case "scene":
            const container = await preloadSceneScriptAsset(key, rootUrl, scene);
            scene.onDisposeObservable.addOnce(() => {
              container.dispose();
              scriptAssetsCache.delete(key);
            });
            scriptAssetsCache.set(key, new AdvancedAssetContainer(container, rootUrl, scriptsMap2));
            break;
          default:
            if (scriptAssetsParsers.has(extension)) {
              const parser = scriptAssetsParsers.get(extension);
              scriptAssetsCache.set(key, await parser({ key, rootUrl, scene }));
              break;
            } else {
              scriptAssetsCache.set(key, await preloadCommonScriptAsset(key, rootUrl));
            }
            break;
        }
      } catch (e) {
        console.error(e);
      }
      resolve();
    }));
  });
  await Promise.all(promises);
  return loadedAssetsCount;
}
__name(_preloadScriptsAssets, "_preloadScriptsAssets");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/decorators/apply.js
function applyDecorators(scene, object, script, instance, rootUrl) {
  const ctor = instance.constructor;
  if (!ctor) {
    return;
  }
  ctor._NodesFromScene?.forEach((params) => {
    instance[params.propertyKey.toString()] = getNodeByName(params.nodeName, scene);
  });
  if (ctor._ComponentsFromScene?.length) {
    scene.getEngine().onBeginFrameObservable.addOnce(() => {
      ctor._ComponentsFromScene?.forEach((params) => {
        const components = [];
        const nodes = [scene, ...scene.transformNodes, ...scene.meshes, ...scene.lights, ...scene.cameras];
        nodes.forEach((node) => {
          const component = getScriptByClassForObject(node, params.componentConstructor);
          if (component) {
            components.push(component);
          }
        });
        if (components.length > 1) {
          throw new Error(`Multiple components of type ${ctor._ComponentsFromScene[0].componentConstructor.name} found in scene for property "${ctor._ComponentsFromScene[0].propertyKey.toString()}".`);
        }
        instance[params.propertyKey.toString()] = components[0] ?? null;
      });
    });
  }
  ctor._NodesFromDescendants?.forEach((params) => {
    const descendant = object.getDescendants?.(params.directDescendantsOnly, (node) => node.name === params.nodeName)[0];
    instance[params.propertyKey.toString()] = descendant ?? null;
  });
  ctor._AnimationGroups?.forEach((params) => {
    instance[params.propertyKey.toString()] = scene.getAnimationGroupByName(params.animationGroupName);
  });
  ctor._SoundsFromScene?.forEach((params) => {
    const sound = getNodeByName(params.soundName, scene);
    if (sound && isSoundNode(sound)) {
      instance[params.propertyKey.toString()] = sound ?? null;
    }
  });
  (ctor._GuiFromAsset ?? []).map(async (params) => {
    const guiUrl = `${rootUrl}assets/${params.pathInAssets}`;
    try {
      const data = await loadJsonFile(guiUrl);
      const gui = import_babylonjs_gui.AdvancedDynamicTexture.CreateFullscreenUI(data.name, true, scene);
      gui.parseSerializedObject(data.content, false);
      instance[params.propertyKey.toString()] = gui;
      params.onGuiCreated?.(instance, gui);
    } catch (e) {
      console.error(`Failed to load GUI from asset: ${guiUrl}`);
      throw e;
    }
  });
  ctor._ParticleSystemsFromScene?.forEach((params) => {
    const particleSystem = scene.particleSystems?.find((particleSystem2) => {
      if (particleSystem2.name !== params.particleSystemName) {
        return false;
      }
      return params.directDescendantsOnly ? particleSystem2.emitter === object : particleSystem2;
    });
    instance[params.propertyKey.toString()] = particleSystem;
  });
  (ctor._VisibleInInspector ?? []).forEach((params) => {
    const propertyKey = params.propertyKey.toString();
    const attachedScripts = script.values;
    if (!attachedScripts) {
      throw new Error(`No values found for script with key "${script.key}".`);
    }
    if (attachedScripts.hasOwnProperty(propertyKey) && attachedScripts[propertyKey].hasOwnProperty("value")) {
      const value = attachedScripts[propertyKey].value;
      switch (params.configuration.type) {
        case "number":
        case "boolean":
        case "keymap":
        case "string":
          instance[propertyKey] = value;
          break;
        case "vector2":
          instance[propertyKey] = import_babylonjs31.Vector2.FromArray(value);
          break;
        case "vector3":
          instance[propertyKey] = import_babylonjs31.Vector3.FromArray(value);
          break;
        case "color3":
          instance[propertyKey] = import_babylonjs29.Color3.FromArray(value);
          break;
        case "color4":
          instance[propertyKey] = import_babylonjs29.Color4.FromArray(value);
          break;
        case "entity":
          const entityType = params.configuration.entityType;
          switch (entityType) {
            case "node":
            case "sound":
              instance[propertyKey] = getNodeById(value, scene) ?? null;
              break;
            case "animationGroup":
              instance[propertyKey] = scene.getAnimationGroupByName(value) ?? null;
              break;
            case "particleSystem":
              instance[propertyKey] = scene.particleSystems?.find((ps) => ps.id === value) ?? null;
              break;
          }
          break;
        case "texture":
          if (value) {
            instance[propertyKey] = import_babylonjs30.Texture.Parse(value, scene, rootUrl);
          }
          break;
        case "asset":
          if (value) {
            const assetType = params.configuration.assetType;
            const data = scriptAssetsCache.get(value);
            switch (assetType) {
              case "json":
              case "gui":
              case "scene":
              case "navmesh":
              case "cinematic":
                instance[propertyKey] = data;
                break;
              case "ragdoll":
                instance[propertyKey] = copyAndParseRagdollConfiguration(data);
                break;
              case "nodeParticleSystemSet":
                const npss = import_babylonjs32.NodeParticleSystemSet.Parse(data);
                instance[propertyKey] = npss;
                break;
              case "material":
                instance[propertyKey] = import_babylonjs28.Material.Parse(data, scene, rootUrl);
                break;
            }
          }
      }
    }
  });
  let pointerObserver = null;
  let keyboardObserver = null;
  if (ctor._PointerEvents?.length) {
    const wrongMeshListener = ctor._PointerEvents.find((params) => params.options.mode === "attachedMeshOnly");
    if (wrongMeshListener && !isAbstractMesh(object)) {
      throw new Error(`@onPointerEvent with mode "attachedMeshOnly" can only be used on scripts attached to meshes (extends AbstractMesh).`);
    }
    const wrongSceneListener = ctor._PointerEvents.find((params) => params.options.mode !== "global");
    if (wrongSceneListener && !isNode(object)) {
      throw new Error(`@onPointerEvent with mode different from "global" can be used only on scripts attached to Node: Mesh, Light, Camera, TransformNode.`);
    }
    pointerObserver = scene.onPointerObservable.add((pointerInfo) => {
      let pickInfo = null;
      ctor._PointerEvents.forEach((params) => {
        if (!params.eventTypes.includes(pointerInfo.type)) {
          return;
        }
        const propertyKey = params.propertyKey.toString();
        if (params.options.mode === "global") {
          return instance[propertyKey]?.(pointerInfo);
        }
        pickInfo = pointerInfo.pickInfo;
        if (!pickInfo) {
          pickInfo = scene.pick(scene.pointerX, scene.pointerY, (m) => {
            return m.isVisible && m.isPickable && m.isEnabled(true) && !m._masterMesh;
          }, false);
        }
        const pickedMesh = pickInfo.pickedMesh;
        if (pickedMesh) {
          if (params.options.mode === "attachedMeshOnly" && pickedMesh === object) {
            return instance[propertyKey]?.(pointerInfo);
          }
          if (params.options.mode === "includeDescendants" && isNode(object)) {
            const descendants = [object, ...object.getDescendants(false)];
            const pickedDescendant = descendants.find((d) => d === pickedMesh);
            if (pickedDescendant) {
              return instance[propertyKey]?.(pointerInfo);
            }
          }
        }
      });
    });
  }
  if (ctor._KeyboardEvents?.length) {
    keyboardObserver = scene.onKeyboardObservable.add((keyboardInfo) => {
      ctor._KeyboardEvents.forEach((params) => {
        if (!params.eventTypes.includes(keyboardInfo.type)) {
          return;
        }
        instance[params.propertyKey.toString()]?.(keyboardInfo);
      });
    });
  }
  if (ctor._SpritesFromSpriteManager?.length) {
    const spriteManagerNode = object;
    if (!isTransformNode(spriteManagerNode) || !spriteManagerNode.isSpriteManager) {
      return console.error(`@spriteFromSpriteManager decorator can only be used on SpriteManagerNode.`);
    }
    if (!spriteManagerNode.spriteManager) {
      return console.error(`SpriteManagerNode "${spriteManagerNode.name}" has no sprite manager assigned.`);
    }
    ctor._SpritesFromSpriteManager?.forEach((params) => {
      const sprite = spriteManagerNode.spriteManager?.sprites.find((s) => s.name === params.spriteName) || null;
      instance[params.propertyKey.toString()] = sprite;
    });
  }
  if (ctor._AnimationsFromSprite?.length) {
    if (!isSprite(object)) {
      return console.error(`@animationFromSprite decorator can only be used in scripts attached on Sprite.`);
    }
    const spriteAnimations = object.metadata?.spriteAnimations;
    if (!spriteAnimations?.length) {
      return console.error(`Sprite "${object.name}" has no sprite animations assigned.`);
    }
    ctor._AnimationsFromSprite.forEach((params) => {
      const animation = spriteAnimations.find((a) => a.name === params.animationName);
      if (animation) {
        instance[params.propertyKey.toString()] = animation ?? null;
      } else {
        console.warn(`Sprite animation named "${params.animationName}" not found on sprite "${object.name}".`);
      }
    });
  }
  ctor._SceneAssets?.forEach((params) => {
    instance[params.propertyKey.toString()] = scriptAssetsCache.get(params.sceneName);
  });
  return {
    observers: {
      pointerObserver,
      keyboardObserver
    }
  };
}
__name(applyDecorators, "applyDecorators");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/loading/script/apply.js
function _applyScriptsForObject(scene, object, scriptsMap2, rootUrl) {
  if (!object.metadata?.scripts) {
    return;
  }
  object.metadata.scripts?.forEach((script) => {
    if (!script.enabled) {
      return;
    }
    const exports2 = scriptsMap2[script.key];
    if (!exports2) {
      return;
    }
    let result = exports2;
    const observers = {};
    if (exports2.default) {
      result = new exports2.default(object);
      const decoratorsResult = applyDecorators(scene, object, script, result, rootUrl);
      Object.assign(observers, decoratorsResult?.observers ?? {});
    }
    if (result.onStart) {
      observers.onStartObserver = scene.onBeforeRenderObservable.addOnce(() => result.onStart(object));
    }
    if (result.onUpdate) {
      observers.onUpdateObserver = scene.onBeforeRenderObservable.add(() => result.onUpdate(object));
    }
    _registerScriptInstance(object, result, script.key, observers);
  });
  object.metadata.scripts = void 0;
}
__name(_applyScriptsForObject, "_applyScriptsForObject");
var scriptsDictionary = /* @__PURE__ */ new Map();
function _registerScriptInstance(object, scriptInstance, key, observers) {
  const registeredScript = {
    key,
    observers,
    instance: scriptInstance
  };
  if (!scriptsDictionary.has(object)) {
    scriptsDictionary.set(object, [registeredScript]);
  } else {
    scriptsDictionary.get(object).push(registeredScript);
  }
  if (isNode(object) || isAnyParticleSystem(object) || isScene(object) || isSoundNode(object)) {
    object.onDisposeObservable.addOnce((() => {
      const scripts = scriptsDictionary.get(object)?.slice();
      scripts?.forEach((s) => {
        _removeRegisteredScriptInstance(object, s);
      });
      scriptsDictionary.delete(object);
    }));
  }
}
__name(_registerScriptInstance, "_registerScriptInstance");
function _removeRegisteredScriptInstance(object, registeredScript) {
  registeredScript.observers.onStartObserver?.remove();
  registeredScript.observers.onUpdateObserver?.remove();
  registeredScript.observers.pointerObserver?.remove();
  registeredScript.observers.keyboardObserver?.remove();
  try {
    registeredScript.instance.onStop?.(object);
  } catch (e) {
    console.error(`Failed to call onStop for script ${registeredScript.key} on object ${object}`, e);
  }
  const runningScripts = scriptsDictionary.get(object);
  const index = runningScripts?.indexOf(registeredScript) ?? -1;
  if (index !== -1) {
    runningScripts?.splice(index, 1);
  }
}
__name(_removeRegisteredScriptInstance, "_removeRegisteredScriptInstance");
function getAllScriptsByClassForObject(object, classType) {
  const data = scriptsDictionary.get(object);
  const result = data?.filter((s) => s.instance.constructor === classType);
  return result?.map((r) => r.instance) ?? null;
}
__name(getAllScriptsByClassForObject, "getAllScriptsByClassForObject");
function getScriptByClassForObject(object, classType) {
  const result = getAllScriptsByClassForObject(object, classType);
  return result?.[0] ?? null;
}
__name(getScriptByClassForObject, "getScriptByClassForObject");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/loading/texture.js
var import_babylonjs33 = require("babylonjs");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/tools/texture.js
function addExcludedCompressedTexture(engine, textureUrl) {
  if (engine._excludedCompressedTextures && !engine._excludedCompressedTextures?.includes(textureUrl)) {
    engine._excludedCompressedTextures?.push(textureUrl);
  }
}
__name(addExcludedCompressedTexture, "addExcludedCompressedTexture");
function getTextureUrl(sourceProperty, scene) {
  if (scene.loadingTexturesQuality === "high" || !sourceProperty.metadata?.baseSize) {
    return sourceProperty.name;
  }
  const width = sourceProperty.metadata.baseSize.width;
  const height = sourceProperty.metadata.baseSize.height;
  const isPowerOfTwo = width === getPowerOfTwoUntil(width) || height === getPowerOfTwoUntil(height);
  let suffix = "";
  switch (scene.loadingTexturesQuality) {
    case "medium":
      let midWidth = width * 0.66 >> 0;
      let midHeight = height * 0.66 >> 0;
      if (isPowerOfTwo) {
        midWidth = getPowerOfTwoUntil(midWidth);
        midHeight = getPowerOfTwoUntil(midHeight);
      }
      suffix = `_${midWidth}_${midHeight}`;
      break;
    case "low":
    case "very-low":
      let lowWidth = width * 0.33 >> 0;
      let lowHeight = height * 0.33 >> 0;
      if (isPowerOfTwo) {
        lowWidth = getPowerOfTwoUntil(lowWidth);
        lowHeight = getPowerOfTwoUntil(lowHeight);
      }
      suffix = `_${lowWidth}_${lowHeight}`;
      break;
  }
  const name = sourceProperty.name;
  if (!name || !suffix) {
    return sourceProperty.name;
  }
  const finalUrl = name.split("/");
  const filename = finalUrl.pop();
  if (!filename) {
    return sourceProperty.name;
  }
  const extension = filename.split(".").pop();
  const baseFilename = filename.replace(`.${extension}`, "");
  const newFilename = `${baseFilename}${suffix}.${extension}`;
  finalUrl.push(newFilename);
  return finalUrl.join("/");
}
__name(getTextureUrl, "getTextureUrl");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/loading/texture.js
var registered2 = false;
function registerTextureParser() {
  if (registered2) {
    return;
  }
  registered2 = true;
  const textureParser = import_babylonjs33.SerializationHelper._TextureParser;
  import_babylonjs33.SerializationHelper._TextureParser = (sourceProperty, scene, rootUrl) => {
    const suffix = getTextureUrl(sourceProperty, scene);
    if (!suffix) {
      return textureParser(sourceProperty, scene, rootUrl);
    }
    const originalName = sourceProperty.name;
    sourceProperty.name = suffix;
    const texture = textureParser(sourceProperty, scene, rootUrl);
    if (texture) {
      texture.name = originalName;
    }
    return texture;
  };
}
__name(registerTextureParser, "registerTextureParser");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/loading/shadows.js
var import_babylonjs34 = require("babylonjs");
var import_babylonjs35 = require("babylonjs");
var import_babylonjs36 = require("babylonjs");
var import_babylonjs37 = require("babylonjs");
var registered3 = false;
function registerShadowGeneratorParser() {
  if (registered3) {
    return;
  }
  registered3 = true;
  (0, import_babylonjs37.RegisterShadowGeneratorSceneComponent)(import_babylonjs35.ShadowGenerator);
  const shadowsGeneratorParser = (0, import_babylonjs36.GetParser)(import_babylonjs34.SceneComponentConstants.NAME_SHADOWGENERATOR);
  (0, import_babylonjs36.AddParser)("ShadowGeneratorEditorPlugin", (parsedData, scene, container, rootUrl) => {
    const savedShadowGenerators = /* @__PURE__ */ new Map();
    parsedData.shadowGenerators?.forEach((shadowGenerator) => {
      savedShadowGenerators.set(shadowGenerator.id, shadowGenerator.mapSize);
      if (scene.loadingShadowsQuality !== "high") {
        switch (scene.loadingShadowsQuality) {
          case "medium":
            shadowGenerator.mapSize = shadowGenerator.mapSize * 0.5;
            break;
          case "low":
            shadowGenerator.mapSize = shadowGenerator.mapSize * 0.25;
            break;
          case "very-low":
            shadowGenerator.mapSize = shadowGenerator.mapSize * 0.125;
            break;
        }
        shadowGenerator.mapSize = Math.max(128, getPowerOfTwoUntil(shadowGenerator.mapSize));
      }
    });
    shadowsGeneratorParser?.(parsedData, scene, container, rootUrl);
    scene.lights.forEach((light) => {
      const shadowGenerator = light.getShadowGenerator();
      const shadowMap = shadowGenerator?.getShadowMap();
      if (shadowMap) {
        const id = shadowGenerator.id;
        const savedMapSize = savedShadowGenerators.get(id);
        if (savedMapSize) {
          shadowGenerator.originalMapSize = savedMapSize;
        }
      }
    });
  });
}
__name(registerShadowGeneratorParser, "registerShadowGeneratorParser");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/loading/morph-target-manager.js
var import_babylonjs38 = require("babylonjs");
var import_babylonjs39 = require("babylonjs");
var registered4 = false;
function registerMorphTargetManagerParser() {
  if (registered4) {
    return;
  }
  registered4 = true;
  (0, import_babylonjs39.AddParser)("MorphTargetManagerEditorPlugin", (parsedData, scene, container, rootUrl) => {
    parsedData.morphTargetManagers.forEach((morphTargetManagerData) => {
      const meshInstance = container.meshes.find((mesh) => {
        return mesh.id === morphTargetManagerData.meshId;
      });
      const morphTargetManager = meshInstance?.morphTargetManager;
      if (!morphTargetManager) {
        return;
      }
      const shouldExit = morphTargetManagerData.targets.find((target) => !target.delayLoadingFile);
      if (shouldExit) {
        return;
      }
      const promises = [];
      morphTargetManagerData.targets.forEach((target) => {
        if (!target.delayLoadingFile) {
          return promises.push(Promise.resolve(null));
        }
        const absolutePath = `${rootUrl}${target.delayLoadingFile}`;
        scene.addPendingData(absolutePath);
        const request = new import_babylonjs38.WebRequest();
        request.responseType = "arraybuffer";
        request.open("GET", absolutePath);
        request.send();
        promises.push(new Promise((resolve) => {
          request.addEventListener("load", () => {
            scene.removePendingData(absolutePath);
            resolve(request.response);
          });
        }));
      });
      Promise.all(promises).then((allBuffers) => {
        for (let i = 0, len = morphTargetManager.numTargets; i < len; ++i) {
          const instancedTarget = morphTargetManager.getTarget(i);
          const sourceTargetData = morphTargetManagerData.targets[i];
          const buffer = allBuffers[i];
          if (sourceTargetData.positionsCount) {
            const positions = new Float32Array(buffer, sourceTargetData.positionsOffset, sourceTargetData.positionsCount);
            instancedTarget["_positions"] = positions;
            instancedTarget.setPositions(positions);
          }
          if (sourceTargetData.normalsCount) {
            const normals = new Float32Array(buffer, sourceTargetData.normalsOffset, sourceTargetData.normalsCount);
            instancedTarget["_normals"] = normals;
            instancedTarget.setNormals(normals);
          }
          if (sourceTargetData.tangentsCount) {
            const tangents = new Float32Array(buffer, sourceTargetData.tangentsOffset, sourceTargetData.tangentsCount);
            instancedTarget["_tangents"] = tangents;
            instancedTarget.setTangents(tangents);
          }
          if (sourceTargetData.uvsCount) {
            const uvs = new Float32Array(buffer, sourceTargetData.uvsOffset, sourceTargetData.uvsCount);
            instancedTarget["_uvs"] = uvs;
            instancedTarget.setUVs(uvs);
          }
          if (sourceTargetData.uv2sCount) {
            const uv2s = new Float32Array(buffer, sourceTargetData.uv2sOffset, sourceTargetData.uv2sCount);
            instancedTarget["_uv2s"] = uv2s;
            instancedTarget.setUV2s(uv2s);
          }
        }
        for (let i = 0, len = morphTargetManager.numTargets; i < len; ++i) {
          const instancedTarget = morphTargetManager.getTarget(i);
          instancedTarget._onDataLayoutChanged.notifyObservers();
        }
      });
    });
  });
}
__name(registerMorphTargetManagerParser, "registerMorphTargetManagerParser");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/loading/light.js
var import_babylonjs40 = require("babylonjs");
function configureLights(scene, clusteredLightContainer) {
  clusteredLightContainer ??= new import_babylonjs40.ClusteredLightContainer("Clustered Light Container", [], scene);
  const clusteredLight = scene.metadata?.clusteredLight;
  if (clusteredLight) {
    if (clusteredLight.lights.length > 0) {
      clusteredLightContainer.horizontalTiles = clusteredLight.horizontalTiles;
      clusteredLightContainer.verticalTiles = clusteredLight.verticalTiles;
      clusteredLightContainer.depthSlices = clusteredLight.depthSlices;
      clusteredLightContainer.maxRange = clusteredLight.maxRange;
    }
    clusteredLight.lights.forEach((lightId) => {
      const light = scene.getLightById(lightId);
      if (light) {
        clusteredLightContainer?.addLight(light);
      }
    });
  }
  return clusteredLightContainer;
}
__name(configureLights, "configureLights");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/loading/sprite-map.js
var import_babylonjs41 = require("babylonjs");
var import_babylonjs42 = require("babylonjs");
var import_babylonjs43 = require("babylonjs");
var import_babylonjs44 = require("babylonjs");
var import_babylonjs45 = require("babylonjs");
var import_babylonjs46 = require("babylonjs");
var import_babylonjs47 = require("babylonjs");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/tools/sprite.js
function normalizeAtlasJson(data) {
  if (!Array.isArray(data.frames)) {
    const frames = [];
    for (const key of Object.keys(data.frames)) {
      frames.push({
        filename: key,
        ...data.frames[key]
      });
    }
    data.frames = frames;
  }
}
__name(normalizeAtlasJson, "normalizeAtlasJson");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/loading/sprite-map.js
var registered5 = false;
function registerSpriteMapParser() {
  if (registered5) {
    return;
  }
  registered5 = true;
  (0, import_babylonjs47.AddParser)("SpriteMapNode", (parsedData, scene, container, rootUrl) => {
    parsedData.transformNodes?.forEach((transformNode) => {
      if (!transformNode.isSpriteMap) {
        return;
      }
      const instance = container.transformNodes?.find((t) => t.id === transformNode.id);
      if (!instance) {
        return;
      }
      instance.isSpriteMap = transformNode.isSpriteMap;
      const atlasJsonAbsolutePath = `${rootUrl}${transformNode.atlasJsonRelativePath}`;
      scene.addPendingData(atlasJsonAbsolutePath);
      const atlasRequest = new import_babylonjs43.WebRequest();
      atlasRequest.open("GET", atlasJsonAbsolutePath);
      atlasRequest.send();
      atlasRequest.addEventListener("load", () => {
        scene.removePendingData(atlasJsonAbsolutePath);
        const atlasJson = JSON.parse(atlasRequest.responseText);
        normalizeAtlasJson(atlasJson);
        const imagePath = `${import_babylonjs41.Tools.GetFolderPath(atlasJsonAbsolutePath)}${atlasJson.meta.image}`;
        const spritesheet = new import_babylonjs45.Texture(imagePath, scene, false, false, import_babylonjs45.Texture.NEAREST_NEAREST, null, null, null, false, import_babylonjs42.Engine.TEXTUREFORMAT_RGBA);
        const spriteMap = new import_babylonjs44.SpriteMap(instance.name, atlasJson, spritesheet, {
          layerCount: transformNode.options.layerCount,
          stageSize: import_babylonjs46.Vector2.FromArray(transformNode.options.stageSize ?? [10, 1]),
          outputSize: import_babylonjs46.Vector2.FromArray(transformNode.options.outputSize ?? [100, 100]),
          colorMultiply: import_babylonjs46.Vector3.FromArray(transformNode.options.colorMultiply ?? [1, 1, 1]),
          flipU: true
        }, scene);
        transformNode.tiles.forEach((tile) => {
          for (let x = 0, lenX = tile.repeatCount.x + 1; x < lenX; ++x) {
            for (let y = 0, lenY = tile.repeatCount.y + 1; y < lenY; ++y) {
              const offsetX = x * (tile.repeatOffset.x + 1);
              const offsetY = y * (tile.repeatOffset.y + 1);
              spriteMap.changeTiles(tile.layer, new import_babylonjs46.Vector2(tile.position.x + offsetX, (spriteMap.options.stageSize?.y ?? 0) - 1 - tile.position.y - offsetY), tile.tile);
            }
          }
        });
        const outputPlane = spriteMap["_output"];
        outputPlane.parent = instance;
        instance.spriteMap = spriteMap;
      });
    });
  });
}
__name(registerSpriteMapParser, "registerSpriteMapParser");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/loading/sprite-manager.js
var import_babylonjs48 = require("babylonjs");
var import_babylonjs49 = require("babylonjs");
var import_babylonjs50 = require("babylonjs");
var import_babylonjs51 = require("babylonjs");
var import_babylonjs52 = require("babylonjs");
function parseSerializedSpriteManager(spriteManager, parsedSpriteManager) {
  if (parsedSpriteManager?.fogEnabled !== void 0) {
    spriteManager.fogEnabled = parsedSpriteManager?.fogEnabled;
  }
  if (parsedSpriteManager?.blendMode !== void 0) {
    spriteManager.blendMode = parsedSpriteManager?.blendMode;
  }
  if (parsedSpriteManager?.disableDepthWrite !== void 0) {
    spriteManager.disableDepthWrite = parsedSpriteManager?.disableDepthWrite;
  }
  if (parsedSpriteManager?.pixelPerfect !== void 0) {
    spriteManager.pixelPerfect = parsedSpriteManager?.pixelPerfect;
  }
  if (parsedSpriteManager?.useLogarithmicDepth !== void 0) {
    spriteManager.useLogarithmicDepth = parsedSpriteManager?.useLogarithmicDepth;
  }
  if (parsedSpriteManager?.metadata !== void 0) {
    spriteManager.metadata = parsedSpriteManager?.metadata;
  }
  for (const parsedSprite of parsedSpriteManager?.sprites ?? []) {
    const sprite = import_babylonjs49.Sprite.Parse(parsedSprite, spriteManager);
    sprite.uniqueId = parsedSprite.uniqueId;
    sprite.metadata = parsedSprite.metadata;
  }
}
__name(parseSerializedSpriteManager, "parseSerializedSpriteManager");
var registered6 = false;
function registerSpriteManagerParser() {
  if (registered6) {
    return;
  }
  registered6 = true;
  (0, import_babylonjs52.AddParser)("SpriteManagerNode", (parsedData, scene, container, rootUrl) => {
    parsedData.transformNodes?.forEach((transformNode) => {
      if (!transformNode.isSpriteManager) {
        return;
      }
      const instance = container.transformNodes?.find((t) => t.id === transformNode.id);
      if (!instance) {
        return;
      }
      const engine = scene.getEngine();
      instance.isSpriteManager = transformNode.isSpriteManager;
      if (transformNode.atlasJsonRelativePath) {
        const atlasJsonAbsolutePath = `${rootUrl}${transformNode.atlasJsonRelativePath}`;
        scene.addPendingData(atlasJsonAbsolutePath);
        const request = new import_babylonjs50.WebRequest();
        request.open("GET", atlasJsonAbsolutePath);
        request.send();
        request.addEventListener("load", () => {
          scene.removePendingData(atlasJsonAbsolutePath);
          const atlasJson = JSON.parse(request.responseText);
          const imagePath = `${import_babylonjs48.Tools.GetFolderPath(atlasJsonAbsolutePath)}${atlasJson.meta.image}`;
          addExcludedCompressedTexture(engine, imagePath);
          const spriteManager = new import_babylonjs51.SpriteManager(instance.name, imagePath, 1e3, 64, scene, void 0, void 0, true, atlasJson);
          instance.spriteManager = spriteManager;
          if (transformNode.spriteManager) {
            parseSerializedSpriteManager(spriteManager, transformNode.spriteManager);
          }
        });
      } else if (transformNode.spriteManager?.textureUrl) {
        addExcludedCompressedTexture(engine, transformNode.spriteManager.textureUrl);
        const imagePath = `${rootUrl}${transformNode.spriteManager.textureUrl}`;
        const spriteManager = new import_babylonjs51.SpriteManager(instance.name, imagePath, 1e3, {
          width: transformNode.spriteManager.cellWidth,
          height: transformNode.spriteManager.cellHeight
        }, scene, void 0, void 0, false);
        instance.spriteManager = spriteManager;
        if (transformNode.spriteManager) {
          parseSerializedSpriteManager(spriteManager, transformNode.spriteManager);
        }
      }
    });
  });
}
__name(registerSpriteManagerParser, "registerSpriteManagerParser");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/loading/node-particle-system-set.js
var import_babylonjs53 = require("babylonjs");
var import_babylonjs54 = require("babylonjs");
var registered7 = false;
function registerNodeParticleSystemSetParser() {
  if (registered7) {
    return;
  }
  registered7 = true;
  (0, import_babylonjs53.AddParser)("NodeParticleSystemSetEditorPlugin", (parsedData, scene, container, rootUrl) => {
    parsedData.meshes?.forEach((mesh) => {
      if (!mesh.isNodeParticleSystemMesh) {
        return;
      }
      const instance = container.meshes?.find((m) => m.id === mesh.id);
      if (!instance) {
        return;
      }
      mesh.nodeParticleSystemSet.blocks?.forEach((block) => {
        if (block.url) {
          block.url = `${rootUrl}${block.url}`;
        }
      });
      instance.nodeParticleSystemSet = import_babylonjs54.NodeParticleSystemSet.Parse(mesh.nodeParticleSystemSet);
      instance.nodeParticleSystemSet.id = mesh.nodeParticleSystemSet.id;
      instance.nodeParticleSystemSet.uniqueId = mesh.uniqueId;
      scene.addPendingData(mesh.id);
      instance.nodeParticleSystemSet.buildAsync(scene, false).then((particleSystemSet) => {
        scene.removePendingData(mesh.id);
        instance.particleSystemSet = particleSystemSet;
        particleSystemSet.systems.forEach((particleSystem) => {
          if (isParticleSystem(particleSystem)) {
            const sizeCreationProcess = particleSystem._sizeCreation.process;
            if (sizeCreationProcess) {
              particleSystem._sizeCreation.process = (particle, system) => {
                sizeCreationProcess(particle, system);
                particle.scale.x *= 100;
                particle.scale.y *= 100;
              };
            }
          }
        });
        particleSystemSet.emitterNode = instance;
        particleSystemSet.start();
      });
    });
  });
}
__name(registerNodeParticleSystemSetParser, "registerNodeParticleSystemSetParser");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/loading/loader.js
var sceneConfigurationMap = /* @__PURE__ */ new Map();
async function waitForWaitingItems(scene, onProgress) {
  const waitingItemsCount = scene.getWaitingItemsCount();
  while (!scene.isDisposed && (!scene.isReady() || scene.getWaitingItemsCount() > 0)) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const loadedItemsCount = waitingItemsCount - scene.getWaitingItemsCount();
    if (loadedItemsCount === waitingItemsCount) {
      scene.textures.forEach((texture) => {
        if (texture.delayLoadState === import_babylonjs56.Constants.DELAYLOADSTATE_NONE) {
          texture.delayLoadState = import_babylonjs56.Constants.DELAYLOADSTATE_LOADED;
        }
      });
    }
    onProgress(loadedItemsCount / waitingItemsCount);
  }
}
__name(waitForWaitingItems, "waitForWaitingItems");
async function loadScene(rootUrl, sceneFilename, scene, scriptsMap2, options) {
  scene.loadingQuality = options?.quality ?? "high";
  scene.loadingTexturesQuality = options?.texturesQuality ?? scene.loadingQuality;
  scene.loadingShadowsQuality = options?.shadowsQuality ?? scene.loadingQuality;
  scene.loadingLodsQuality = options?.lodsQuality ?? scene.loadingQuality;
  registerAudioParser();
  registerTextureParser();
  registerShadowGeneratorParser();
  registerMorphTargetManagerParser();
  registerSpriteMapParser();
  registerSpriteManagerParser();
  registerNodeParticleSystemSetParser();
  const configuration = sceneConfigurationMap.get(scene) ?? {};
  sceneConfigurationMap.set(scene, configuration);
  await (0, import_babylonjs57.AppendSceneAsync)(`${rootUrl}${sceneFilename}`, scene, {
    pluginExtension: ".babylon",
    onProgress: /* @__PURE__ */ __name((event) => {
      const progress = Math.min(event.loaded / event.total * 0.5);
      options?.onProgress?.(progress);
    }, "onProgress")
  });
  await waitForWaitingItems(scene, (progress) => {
    options?.onProgress?.(0.5 + progress * 0.25);
  });
  if (!options?.skipAssetsPreload) {
    let loadedAssetsCount = 0;
    do {
      loadedAssetsCount = await _preloadScriptsAssets(rootUrl, scene, scriptsMap2);
    } while (loadedAssetsCount !== 0 && !scene.isDisposed);
  }
  if (import_babylonjs58.SceneLoaderFlags.ForceFullSceneLoadingForIncremental) {
    scene.meshes.forEach((m) => isMesh(m) && m._checkDelayState());
  }
  const clusteredLightContainer = configureLights(scene, configuration.clusteredLightContainer);
  configuration.clusteredLightContainer = clusteredLightContainer;
  await waitForWaitingItems(scene, (progress) => {
    options?.onProgress?.(0.75 + progress * 0.25);
  });
  options?.onProgress?.(1);
  configureMeshDistanceOrScreenCoverage(scene);
  applyMeshesLODQuality(scene.loadingLodsQuality, scene);
  configureShadowMapRenderListPredicate(scene);
  configureShadowMapRefreshRate(scene);
  if (scene.metadata?.rendering) {
    applyRenderingConfigurations(scene, scene.metadata.rendering);
    if (scene.activeCamera) {
      applyRenderingConfigurationForCamera(scene.activeCamera, rootUrl, options?.postProcessConfiguration);
    }
  }
  if (scene.metadata?.physicsGravity) {
    scene.getPhysicsEngine()?.setGravity(import_babylonjs55.Vector3.FromArray(scene.metadata?.physicsGravity));
  }
  _applyScriptsForObject(scene, scene, scriptsMap2, rootUrl);
  scene.transformNodes.forEach((transformNode) => {
    _applyScriptsForObject(scene, transformNode, scriptsMap2, rootUrl);
  });
  scene.meshes.forEach((mesh) => {
    configurePhysicsAggregate(mesh);
    _applyScriptsForObject(scene, mesh, scriptsMap2, rootUrl);
  });
  scene.lights.forEach((light) => {
    _applyScriptsForObject(scene, light, scriptsMap2, rootUrl);
  });
  scene.cameras.forEach((camera) => {
    _applyScriptsForObject(scene, camera, scriptsMap2, rootUrl);
  });
  scene.spriteManagers?.forEach((spriteManager) => {
    spriteManager.sprites.forEach((sprite) => {
      _applyScriptsForObject(scene, sprite, scriptsMap2, rootUrl);
    });
  });
  configureTransformNodes(scene);
}
__name(loadScene, "loadScene");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/loading/material.js
var import_babylonjs59 = require("babylonjs");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/tools/animation.js
var import_babylonjs60 = require("babylonjs");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/tools/particle.js
var import_babylonjs61 = require("babylonjs");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/decorators/inspector.js
function visibleAsNumber(label, configuration) {
  return function(target, propertyKey) {
    const ctor = target.constructor;
    ctor._VisibleInInspector ??= [];
    ctor._VisibleInInspector.push({
      label,
      propertyKey,
      configuration: {
        ...configuration,
        type: "number"
      }
    });
  };
}
__name(visibleAsNumber, "visibleAsNumber");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/cinematic/parse.js
var import_babylonjs63 = require("babylonjs");
var import_babylonjs64 = require("babylonjs");
var import_babylonjs65 = require("babylonjs");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/cinematic/tools.js
var import_babylonjs62 = require("babylonjs");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/cinematic/generate.js
var import_babylonjs69 = require("babylonjs");
var import_babylonjs70 = require("babylonjs");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/cinematic/events/apply-impulse.js
var import_babylonjs66 = require("babylonjs");
var zeroVector = import_babylonjs66.Vector3.Zero();

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/cinematic/cinematic.js
var import_babylonjs67 = require("babylonjs");
var import_babylonjs68 = require("babylonjs");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/loading/database/database.js
var import_babylonjs71 = require("babylonjs");

// ../../PROJECTS/BABYLON_JS/project_002/node_modules/babylonjs-editor-tools/build/src/loading/database/preload.js
var supportedJsonExtensions = ["babylon", "json"];
var supportedImageExtensions = ["jpg", "jpeg", "png", "bmp", "webp"];
var supportedBinaryExtensions = ["bin", "babylonbinarymeshdata", "mp3", "wav", "ktx", "ktx2"];
var allSupportedExtensions = [...supportedJsonExtensions, ...supportedImageExtensions, ...supportedBinaryExtensions];

// ../../PROJECTS/BABYLON_JS/project_002/src/scripts/splat_loader_script_001.ts
var splat_loader_script_001_exports = {};
__export(splat_loader_script_001_exports, {
  default: () => SplatLoaderScript
});
var import_babylonjs72 = require("babylonjs");
var import_babylonjs_loaders = require("babylonjs-loaders");
var SplatLoaderScript = class {
  static {
    __name(this, "SplatLoaderScript");
  }
  _attachedNode;
  constructor(attachedNode) {
    this._attachedNode = attachedNode;
  }
  async onStart() {
    console.log(">>> Splat loader initialized.");
    const optimizedUrl = "https://assets.babylonjs.com/splats/gs_Skull.splat";
    const scene = this._attachedNode.getScene();
    try {
      console.log(">>> Downloading optimized splat asset...");
      const result = await (0, import_babylonjs72.ImportMeshAsync)(optimizedUrl, scene);
      const splatMesh = result.meshes[0];
      if (splatMesh) {
        splatMesh.name = "Optimized_Splat_Mesh";
        splatMesh.parent = this._attachedNode;
        splatMesh.position = new import_babylonjs72.Vector3(0, 0, 2);
        console.log(">>> Asset successfully spawned at relative coordinates (0, 0, 2).");
      }
    } catch (error) {
      console.error(">>> Runtime error during asset placement:", error);
    }
  }
};

// ../../PROJECTS/BABYLON_JS/project_002/src/scripts/box.ts
var box_exports = {};
__export(box_exports, {
  default: () => SceneComponent
});
var import_babylonjs73 = require("babylonjs");
var SceneComponent = class {
  constructor(mesh) {
    this.mesh = mesh;
  }
  static {
    __name(this, "SceneComponent");
  }
  _speed = 0.9;
  onStart() {
  }
  onUpdate() {
    this.mesh.rotate(import_babylonjs73.Vector3.UpReadOnly, this._speed * this.mesh.getScene().getAnimationRatio());
  }
};
__decorateClass([
  visibleAsNumber("Speed", {
    min: 0,
    max: 9.1
  })
], SceneComponent.prototype, "_speed", 2);

// ../../PROJECTS/BABYLON_JS/project_002/src/scripts.ts
var scriptsMap = {
  "scripts/splat_loader_script_001.ts": splat_loader_script_001_exports,
  "scripts/box.ts": box_exports
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  _applyScriptsForObject,
  _preloadScriptsAssets,
  _removeRegisteredScriptInstance,
  loadScene,
  scriptAssetsCache,
  scriptsDictionary,
  scriptsMap
});
//# sourceMappingURL=script.cjs.map
