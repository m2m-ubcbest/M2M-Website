import * as THREE from "three";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef } from "react";
import {
  GLTFLoader,
  OrbitControls,
  type GLTF,
} from "three/examples/jsm/Addons.js";

export interface ThreeDisplayProps {
  fileName?: string;
  className?: string;
  style?: CSSProperties;
  useVariableSpeed?: boolean;
  zoomMultiplier?: number;
  elevationAngle?: number;
}

const ThreeDisplay = ({
  className,
  style,
  fileName = "app.glb",
  useVariableSpeed = true,
  zoomMultiplier = 1.5,
  elevationAngle = 0,
}: ThreeDisplayProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationIdRef = useRef<number>(0);
  const fitDistanceRef = useRef<number>(0);
  const resetTimeoutRef = useRef<number | undefined>(undefined);
  const initialCameraPositionRef = useRef(new THREE.Vector3());
  const initialTargetRef = useRef(new THREE.Vector3());
  const zoomMultiplierRef = useRef(zoomMultiplier);
  const elevationAngleRef = useRef(elevationAngle);

  const applyCameraSettings = useCallback(() => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    const fitDistance = fitDistanceRef.current;

    if (!camera || !controls || fitDistance <= 0) {
      return;
    }

    const clampedZoom = Math.max(0.1, zoomMultiplierRef.current);
    const clampedAngle = THREE.MathUtils.clamp(
      elevationAngleRef.current,
      -89,
      89
    );
    const distance = fitDistance * clampedZoom;
    const elevationRadians = THREE.MathUtils.degToRad(clampedAngle);

    const y = Math.sin(elevationRadians) * distance;
    const z = Math.cos(elevationRadians) * distance;

    camera.position.set(0, y, z);
    camera.near = Math.max(0.1, distance / 10);
    camera.far = distance * 10;
    camera.lookAt(controls.target);
    camera.updateProjectionMatrix();

    initialCameraPositionRef.current.copy(camera.position);
    initialTargetRef.current.copy(controls.target);
    controls.update();
  }, []);

  useEffect(() => {
    zoomMultiplierRef.current = zoomMultiplier;
    applyCameraSettings();
  }, [zoomMultiplier, applyCameraSettings]);

  useEffect(() => {
    elevationAngleRef.current = elevationAngle;
    applyCameraSettings();
  }, [elevationAngle, applyCameraSettings]);

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
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(initialWidth, initialHeight);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;
    currentMount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = true;
    controlsRef.current = controls;

    const slowAutoSpeed = 2;
    const fastAutoSpeed = 15;
    let currentAutoSpeed = useVariableSpeed ? slowAutoSpeed : 3;
    controls.autoRotateSpeed = currentAutoSpeed;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 4, 5);

    scene.add(ambientLight, directionalLight);

    const loader = new GLTFLoader();

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

        fitDistanceRef.current = fitDistance;
        controls.target.set(0, 0, 0);
        controls.update();
        applyCameraSettings();

        if (resetTimeoutRef.current !== undefined) {
          window.clearTimeout(resetTimeoutRef.current);
        }
        resetTimeoutRef.current = window.setTimeout(() => {
          if (!cameraRef.current || !controlsRef.current) {
            return;
          }
          cameraRef.current.position.copy(initialCameraPositionRef.current);
          controlsRef.current.target.copy(initialTargetRef.current);
          cameraRef.current.lookAt(initialTargetRef.current);
          controlsRef.current.update();
        }, 5000);
      },
      undefined,
      (error) => {
        console.error(`Failed to load ${fileName}:`, error);
      }
    );

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      const renderer = rendererRef.current;
      const camera = cameraRef.current;
      const controls = controlsRef.current;

      if (!renderer || !camera || !controls) {
        return;
      }

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
      const mount = mountRef.current;
      const camera = cameraRef.current;
      const renderer = rendererRef.current;
      if (!mount || !camera || !renderer) {
        return;
      }
      const width = mount.clientWidth || window.innerWidth;
      const height = mount.clientHeight || window.innerHeight;
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
      cancelAnimationFrame(animationIdRef.current);
      controlsRef.current?.dispose();
      rendererRef.current?.dispose();
      window.removeEventListener("resize", handleResize);
      resizeObserver?.disconnect();
      if (resetTimeoutRef.current !== undefined) {
        window.clearTimeout(resetTimeoutRef.current);
      }
      scene.clear();
      if (rendererRef.current) {
        const dom = rendererRef.current.domElement;
        if (dom.parentNode === currentMount) {
          currentMount.removeChild(dom);
        }
      }
      rendererRef.current = null;
      cameraRef.current = null;
      controlsRef.current = null;
      fitDistanceRef.current = 0;
    };
  }, [applyCameraSettings, fileName, useVariableSpeed]);

  const containerStyle: CSSProperties = {
    width: "100vw",
    height: "100vh",
    ...style,
  };

  return <div ref={mountRef} className={className} style={containerStyle} />;
};

export default ThreeDisplay;
