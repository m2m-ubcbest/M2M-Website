import { useCallback, useState } from "react";

export function useModelZoom(initialMultiplier = 1.5) {
  const [zoomMultiplier, setZoom] = useState(initialMultiplier);

  const setZoomMultiplier = useCallback((multiplier: number) => {
    setZoom(Math.max(0.1, multiplier));
  }, []);

  return { zoomMultiplier, setZoomMultiplier };
}

export function useModelElevation(initialAngleDegrees = 0) {
  const [elevationAngle, setAngle] = useState(initialAngleDegrees);

  const setElevationAngle = useCallback((angleDegrees: number) => {
    setAngle(Math.min(89, Math.max(-89, angleDegrees)));
  }, []);

  return { elevationAngle, setElevationAngle };
}
