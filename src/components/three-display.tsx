import * as THREE from "three";
import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import {
  GLTFLoader,
  OrbitControls,
  type GLTF,
} from "three/examples/jsm/Addons.js";

type ThreeDisplayProps = {
  fileName?: string;
  className?: string;
  style?: CSSProperties;
  useVariableSpeed?: boolean;
};

const ThreeDisplay = ({
  className,
  style,
  fileName = "app.glb",
  useVariableSpeed = true,
}: ThreeDisplayProps) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) {
      return;
    }

    const initialWidth = currentMount.clientWidth || window.innerWidth;
    const initialHeight = currentMount.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      60,
      initialWidth / initialHeight,
      0.1,
      5000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(initialWidth, initialHeight);
    renderer.setClearColor(0x000000, 0);
    currentMount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = true;

    const slowAutoSpeed = 2;
    const fastAutoSpeed = 15;
    let currentAutoSpeed = useVariableSpeed ? slowAutoSpeed : 3;
    controls.autoRotateSpeed = currentAutoSpeed;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 4, 5);

    scene.add(ambientLight, directionalLight);

    const loader = new GLTFLoader();
    const initialCameraPosition = new THREE.Vector3();
    const initialTarget = new THREE.Vector3();
    let resetTimeout: number | undefined;
    loader.load(
      fileName,
      (gltf: GLTF) => {
        const model = gltf.scene;
        scene.add(model);

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        if (size.lengthSq() === 0) {
          return;
        }

        model.position.sub(center);

        const fitHeightDistance =
          size.y / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
        const fitWidthDistance =
          size.x /
          (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) /
          camera.aspect;
        const fitDistance = Math.max(
          fitHeightDistance,
          fitWidthDistance,
          size.z
        );

        camera.position.set(0, 0, fitDistance * 1.5);
        camera.near = Math.max(0.1, fitDistance / 10);
        camera.far = fitDistance * 10;
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        camera.updateProjectionMatrix();

        controls.target.set(0, 0, 0);
        controls.update();
        initialCameraPosition.copy(camera.position);
        initialTarget.copy(controls.target);

        if (resetTimeout !== undefined) {
          window.clearTimeout(resetTimeout);
        }
        resetTimeout = window.setTimeout(() => {
          camera.position.copy(initialCameraPosition);
          controls.target.copy(initialTarget);
          camera.lookAt(initialTarget);
          controls.update();
        }, 5000);
      },
      undefined,
      (error) => {
        console.error("Failed to load app.gltf:", error);
      }
    );

    let animationId = 0;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (useVariableSpeed) {
        const azimuth = controls.getAzimuthalAngle();
        const frontFactor = (Math.cos(azimuth) + 1) / 2;
        const targetSpeed =
          slowAutoSpeed + (1 - frontFactor) * (fastAutoSpeed - slowAutoSpeed);
        currentAutoSpeed = THREE.MathUtils.lerp(
          currentAutoSpeed,
          targetSpeed,
          0.05
        );
      } else {
        currentAutoSpeed = 3;
      }
      controls.autoRotateSpeed = currentAutoSpeed;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const resizeRenderer = () => {
      if (!mountRef.current) {
        return;
      }
      const width = mountRef.current.clientWidth || window.innerWidth;
      const height = mountRef.current.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const handleResize = () => resizeRenderer();
    window.addEventListener("resize", handleResize);

    let resizeObserver: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(resizeRenderer);
      resizeObserver.observe(currentMount);
    }

    return () => {
      cancelAnimationFrame(animationId);
      controls.dispose();
      renderer.dispose();
      window.removeEventListener("resize", handleResize);
      resizeObserver?.disconnect();
      if (resetTimeout !== undefined) {
        window.clearTimeout(resetTimeout);
      }
      scene.clear();
      currentMount.removeChild(renderer.domElement);
    };
  }, [fileName, useVariableSpeed]);

  const containerStyle: CSSProperties = {
    width: "100vw",
    height: "100vh",
    ...style,
  };

  return <div ref={mountRef} className={className} style={containerStyle} />;
};

export default ThreeDisplay;
