"use client";

import { animate } from "animejs";
import { useEffect, useMemo, useRef, useState } from "react";

const RADIUS = 1.75;
const HIT_RADIUS = 20;
const COVERAGE_FACTOR = 0.75;

type GridSettings = {
  columns: number;
  rows: number;
  gap: number;
  dotSize: number;
  width: number;
  height: number;
};

const computeGridSettings = (
  viewportWidth: number,
  viewportHeight: number
): GridSettings => {
  const baseWidth = Math.max(320, viewportWidth);
  const baseHeight = Math.max(480, viewportHeight);
  const density =
    baseWidth < 640
      ? 0.003
      : baseWidth < 1024
      ? 0.00105
      : baseWidth < 1600
      ? 0.00102
      : 0.0003;

  const effectiveWidth = baseWidth * COVERAGE_FACTOR;
  const effectiveHeight = baseHeight * COVERAGE_FACTOR;
  const totalDots = Math.max(
    144,
    Math.round(effectiveWidth * effectiveHeight * density)
  );
  const aspectRatio = effectiveWidth / effectiveHeight;

  const columns = Math.max(14, Math.round(Math.sqrt(totalDots * aspectRatio)));
  const rows = Math.max(16, Math.round(totalDots / columns));

  let cellSize = effectiveWidth / columns;
  let gapRaw = cellSize * 0.45;
  let dotSizeRaw = cellSize * 0.09;

  let gridHeight = rows * cellSize;

  if (gridHeight < effectiveHeight) {
    const scale = effectiveHeight / gridHeight;
    cellSize *= scale;
    gapRaw *= scale;
    dotSizeRaw *= scale;
    gridHeight = rows * cellSize;
  }

  const gap = Math.max(4, Math.min(28, Math.round(gapRaw)));
  const dotSize = Math.max(3, Math.min(12, Math.round(dotSizeRaw)));

  const widthWithGaps = columns * cellSize + gap * (columns - 1);
  const heightWithGaps = rows * cellSize + gap * (rows - 1);

  const minWidth = effectiveWidth;
  const minHeight = effectiveHeight;

  const finalWidth = Math.max(Math.round(widthWithGaps), Math.round(minWidth));
  const finalHeight = Math.max(
    Math.round(heightWithGaps),
    Math.round(minHeight)
  );

  return {
    columns,
    rows,
    gap,
    dotSize,
    width: finalWidth,
    height: finalHeight,
  };
};

const DEFAULT_SETTINGS = computeGridSettings(1280, 720);

export function WaterDropGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [gridSettings, setGridSettings] =
    useState<GridSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateGrid = () => {
      setGridSettings(
        computeGridSettings(window.innerWidth, window.innerHeight)
      );
    };

    updateGrid();
    window.addEventListener("resize", updateGrid);
    return () => window.removeEventListener("resize", updateGrid);
  }, []);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const { columns } = gridSettings;

    const getXY = (index: number) => [
      index % columns,
      Math.floor(index / columns),
    ];

    const getClusterDots = (index: number) => {
      if (!gridRef.current) return [];
      const dots = Array.from(
        gridRef.current.querySelectorAll<HTMLElement>(".dot-point")
      );
      const [cx, cy] = getXY(index);
      return dots.filter((dot) => {
        const originalIndex = Number(dot.dataset.index ?? -1);
        if (originalIndex < 0) return false;
        const [x, y] = getXY(originalIndex);
        const dx = x - cx;
        const dy = y - cy;
        return Math.sqrt(dx * dx + dy * dy) <= RADIUS;
      });
    };

    const handlePointerMove = (clientX: number, clientY: number) => {
      if (!gridRef.current) return;

      const dots = Array.from(
        gridRef.current.querySelectorAll<HTMLElement>(".dot-point")
      );

      let closestIndex = -1;
      let closestDist = Infinity;

      dots.forEach((dot, i) => {
        const rect = dot.getBoundingClientRect();
        const dx = rect.left + rect.width / 2 - clientX;
        const dy = rect.top + rect.height / 2 - clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < closestDist) {
          closestDist = dist;
          closestIndex = i;
        }
      });

      if (closestIndex === -1 || closestDist > HIT_RADIUS) return;

      const cluster = getClusterDots(closestIndex);

      cluster.forEach((dot) => {
        const [cx, cy] = getXY(closestIndex);
        const originalIndex = Number(dot.dataset.index ?? closestIndex);
        const [x, y] = getXY(originalIndex);
        const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        const strength = 1 - dist / (RADIUS + 0.5);

        animate(dot, {
          scale: [
            { to: 1.1 + 0.05 * strength, ease: "outSine", duration: 200 },
            { to: 1, ease: "inOutQuad", duration: 400 },
          ],
          translateY: [
            { to: 0.5 * strength, ease: "outSine", duration: 200 },
            { to: 0, ease: "inOutQuad", duration: 400 },
          ],
          opacity: [
            { to: 1, ease: "outSine", duration: 200 },
            { to: 0.25, ease: "inOutQuad", duration: 400 },
          ],
          persist: false,
        });
      });
    };

    const handleMouseMove = (event: MouseEvent) => {
      handlePointerMove(event.clientX, event.clientY);
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      handlePointerMove(touch.clientX, touch.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [gridSettings]);

  const dots = useMemo(() => {
    const { columns, rows, dotSize } = gridSettings;
    const total = columns * rows;
    return Array.from({ length: total }, (_, index) => (
      <div key={index} className="flex items-center justify-center">
        <div
          className="dot-point rounded-full bg-linear-to-b from-slate-900 to-slate-700 opacity-40"
          data-index={index}
          style={{
            width: `${dotSize}px`,
            height: `${dotSize}px`,
          }}
        />
      </div>
    ));
  }, [gridSettings]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
      <div className="opacity-80">
        <div
          ref={gridRef}
          style={{
            width: `${gridSettings.width}px`,
            height: `${gridSettings.height}px`,
            gridTemplateColumns: `repeat(${gridSettings.columns}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${gridSettings.rows}, minmax(0, 1fr))`,
            gap: `${gridSettings.gap}px`,
          }}
          className="grid max-w-none"
        >
          {dots}
        </div>
      </div>
    </div>
  );
}
