import React from "react";
import Canvas from "./components/Canvas";

import {
  Vector3,
  MeshBuilder,
  HemisphericLight,
  Scene,
  FreeCamera,
  Mesh,
} from "@babylonjs/core";

let box: Mesh;

const onSceneReady = (scene: Scene) => {
  var camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
  camera.setTarget(Vector3.Zero());

  const canvas = scene.getEngine().getRenderingCanvas();
  camera.attachControl(canvas, true);

  var light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
  light.intensity = 0.7;

  box = MeshBuilder.CreateBox("box", { size: 2 }, scene);
  box.position.y = 1;

  MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
};

const App = () => {
  const onRender = (scene: Scene) => {
    if (box !== undefined) {
      var deltaTimeInMillis = scene.getEngine().getDeltaTime();

      const rpm = 10;
      box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
    }
  };

  return (
    <Canvas
      antialias
      id="my-canvas"
      onRender={onRender}
      onSceneReady={onSceneReady}
    />
  );
};

export default App;
