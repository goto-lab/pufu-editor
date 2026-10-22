import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent, ReactNode, RefObject } from "react";
import type { i18n } from "i18next";
import { IoCloseSharp, IoMapOutline } from "react-icons/io5";

interface IScoreViewportProps {
  children: ReactNode;
  enabled: boolean;
  containerRef: RefObject<HTMLDivElement | null>;
  dark: boolean;
  scoreRef: RefObject<HTMLDivElement | null>;
  i18n: i18n;
}

interface IMapNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  radius: number;
}

interface IMapLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  dashed: string | null;
}

export const ScoreViewport = ({
  children,
  enabled,
  containerRef,
  dark,
  scoreRef,
  i18n,
}: IScoreViewportProps) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<SVGSVGElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [isMapOpen, setIsMapOpen] = useState(true);
  const [map, setMap] = useState({
    width: 1,
    height: 1,
    nodes: [] as IMapNode[],
    lines: [] as IMapLine[],
  });
  const [view, setView] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const updateView = () => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    setView({
      x: viewport.scrollLeft,
      y: viewport.scrollTop,
      width: viewport.clientWidth,
      height: viewport.clientHeight,
    });
  };

  useEffect(() => {
    const viewport = viewportRef.current;
    const score = scoreRef.current;
    if (!enabled || !isMapOpen || !viewport || !score) return;

    let frame = 0;
    const updateMap = () => {
      const width = score.offsetWidth;
      const height = score.offsetHeight;
      if (!width || !height) return;
      const bounds = score.getBoundingClientRect();
      // 表示中の実際の配置を縮小し、編集・並べ替え・コメントの開閉にも追従する。
      const elements = score.querySelector<HTMLElement>('[role="elements"]');
      const boxes = Array.from(
        score.querySelectorAll<HTMLElement>("[id]"),
      ).filter((node) => !elements?.contains(node));
      if (elements) boxes.unshift(elements);
      const nodes = boxes
        .map((node) => {
          const rect = node.getBoundingClientRect();
          const style = getComputedStyle(node);
          return {
            id: node === elements ? "eight-elements" : node.id,
            x: rect.left - bounds.left,
            y: rect.top - bounds.top,
            width: rect.width,
            height: rect.height,
            fill:
              style.backgroundColor === "rgba(0, 0, 0, 0)"
                ? dark
                  ? "#374151"
                  : "#e5e7eb"
                : style.backgroundColor,
            radius: style.borderRadius.includes("%") ? rect.width / 2 : 4,
          };
        })
        .filter((node) => node.width > 0 && node.height > 0);
      const lines = Array.from(
        score.querySelectorAll<SVGLineElement>("svg line"),
      )
        .filter((line) => line.getAttribute("visibility") !== "hidden")
        .map((line) => ({
          x1: line.x1.baseVal.value,
          y1: line.y1.baseVal.value,
          x2: line.x2.baseVal.value,
          y2: line.y2.baseVal.value,
          dashed: line.getAttribute("stroke-dasharray"),
        }));
      setMap({
        width,
        height,
        nodes,
        lines,
      });
      updateView();
    };
    const scheduleUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateMap);
    };
    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(score);
    resizeObserver.observe(viewport);
    const mutationObserver = new MutationObserver(scheduleUpdate);
    mutationObserver.observe(score, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
    });
    scheduleUpdate();
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [enabled, isMapOpen, dark, scoreRef]);

  const toggleMap = () => {
    setIsMapOpen((open) => !open);
    requestAnimationFrame(() =>
      toggleRef.current?.focus({ preventScroll: true }),
    );
  };

  const mapScale = Math.min(144 / map.width, 80 / map.height);

  const navigate = (event: PointerEvent<HTMLButtonElement>) => {
    const viewport = viewportRef.current;
    const matrix = mapRef.current?.getScreenCTM();
    if (!viewport || !matrix) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      matrix.inverse(),
    );
    viewport.scrollTo({
      left: point.x - viewport.clientWidth / 2,
      top: point.y - viewport.clientHeight / 2,
      behavior: "instant",
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const steps: Record<string, [number, number]> = {
      ArrowLeft: [-viewport.clientWidth / 2, 0],
      ArrowRight: [viewport.clientWidth / 2, 0],
      ArrowUp: [0, -viewport.clientHeight / 2],
      ArrowDown: [0, viewport.clientHeight / 2],
    };
    if (steps[event.key]) {
      event.preventDefault();
      const [left, top] = steps[event.key];
      viewport.scrollBy({ left, top, behavior: "instant" });
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full min-w-0 max-w-full ${dark ? "dark" : ""}`}
    >
      <div
        ref={viewportRef}
        className={
          enabled
            ? "overflow-auto bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600 dark:bg-gray-900"
            : undefined
        }
        style={
          enabled
            ? {
                maxHeight: "80svh",
              }
            : undefined
        }
        role={enabled ? "region" : undefined}
        aria-label={enabled ? i18n.t("msg.ScoreViewport") : undefined}
        tabIndex={enabled ? 0 : undefined}
        onScroll={enabled ? updateView : undefined}
      >
        {children}
      </div>
      {enabled && (
        <div className="absolute bottom-3 right-3 z-30">
          {isMapOpen ? (
            <div className="rounded-xl border border-gray-300 bg-white/70 px-2 pb-2 pt-1 shadow-lg dark:border-gray-600 dark:bg-gray-900/70">
              <div className="mb-0.5 flex items-center justify-between gap-2">
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  {i18n.t("msg.MiniMap")}
                </p>
                <button
                  ref={toggleRef}
                  type="button"
                  className="flex h-6 w-6 items-center justify-center rounded text-gray-600 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600 dark:text-gray-300 dark:hover:bg-gray-800"
                  aria-label={i18n.t("msg.CloseMiniMap")}
                  title={i18n.t("msg.CloseMiniMap")}
                  onClick={toggleMap}
                >
                  <IoCloseSharp size={18} aria-hidden="true" />
                </button>
              </div>
              <button
                type="button"
                className="mx-auto block touch-none rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600"
                aria-label={i18n.t("msg.MiniMapNavigate")}
                title={i18n.t("msg.MiniMapNavigate")}
                onPointerDown={(event) => {
                  if (event.button !== 0) return;
                  event.currentTarget.setPointerCapture(event.pointerId);
                  navigate(event);
                }}
                onPointerMove={(event) => {
                  if (event.currentTarget.hasPointerCapture(event.pointerId))
                    navigate(event);
                }}
                onKeyDown={handleKeyDown}
                onClick={(event) => {
                  if (event.detail === 0)
                    viewportRef.current?.scrollTo({
                      left: (map.width - view.width) / 2,
                      top: (map.height - view.height) / 2,
                      behavior: "instant",
                    });
                }}
              >
                <svg
                  ref={mapRef}
                  width={map.width * mapScale}
                  height={map.height * mapScale}
                  className="overflow-visible"
                  viewBox={`0 0 ${map.width} ${map.height}`}
                  aria-hidden="true"
                >
                  {map.lines.map((line, index) => (
                    <line
                      key={index}
                      x1={line.x1}
                      y1={line.y1}
                      x2={line.x2}
                      y2={line.y2}
                      stroke="#9ca3af"
                      strokeWidth="0.5"
                      strokeDasharray={line.dashed ?? undefined}
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                  {map.nodes.map((node) => (
                    <rect
                      key={node.id}
                      data-node-id={node.id}
                      x={node.x}
                      y={node.y}
                      width={node.width}
                      height={node.height}
                      rx={node.radius}
                      fill={node.fill}
                      stroke="#9ca3af"
                      strokeWidth="0.75"
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                  <rect
                    x={view.x}
                    y={view.y}
                    width={view.width}
                    height={view.height}
                    fill="rgba(13, 148, 136, 0.1)"
                    stroke={dark ? "#5eead4" : "#0f766e"}
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <button
              ref={toggleRef}
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white/70 text-gray-600 shadow-lg hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600 dark:border-gray-600 dark:bg-gray-900/70 dark:text-gray-300 dark:hover:bg-gray-900"
              aria-label={i18n.t("msg.OpenMiniMap")}
              title={i18n.t("msg.OpenMiniMap")}
              onClick={toggleMap}
            >
              <IoMapOutline size={20} aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
