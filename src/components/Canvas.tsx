import React, { memo, useEffect, useRef } from "react";
import { Engine, Scene, EngineOptions, SceneOptions } from "@babylonjs/core";

interface CanvasProps extends React.HTMLAttributes<HTMLElement> {
  antialias?: boolean;
  engineOptions?: EngineOptions;
  sceneOptions?: SceneOptions;
  onRender: (scene: Scene) => any;
  onSceneReady: (scene: Scene) => any;
}

const Canvas: React.FC<CanvasProps> = memo(
  ({ antialias, sceneOptions, engineOptions, onSceneReady, onRender, children }) => {
    const canvasRef = useRef(null);

    /**
     * Create Engine and Scene
     */
    useEffect(() => {
      const { current: canvas } = canvasRef;
      if (!canvas) return;

      const engine = new Engine(canvas, antialias, engineOptions);
      const scene = new Scene(engine, sceneOptions);

      /**
       * Initialize Scene
       */
      if (scene.isReady()) {
        onSceneReady(scene);
      } else {
        scene.onReadyObservable.addOnce((scene) => onSceneReady(scene));
      }

      /**
       * Render Loop
       */
      engine.runRenderLoop(() => {
        if (typeof onRender === "function") onRender(scene);
        scene.render();
      });

      /**
       * Window Size
       */
      const resize = () => {
        scene.getEngine().resize();
      };

      if (window) {
        window.addEventListener("resize", resize);
      }

      /**
       * Remove Engine and Listener on Component Unmount
       */
      return () => {
        scene.getEngine().dispose();

        if (window) {
          window.removeEventListener("resize", resize);
        }
      };
    }, [antialias, sceneOptions, engineOptions, onSceneReady, onRender]);

    return <canvas ref={canvasRef}>{children}</canvas>;
  }
);

export default Canvas;
