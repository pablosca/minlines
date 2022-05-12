import { useState } from "react";
import useTools from "./ToolsContext";
import PathElement from "./PathElement";
import PolylineElement from "./PolylineElement";
import useBoard from "./BoardContext";

export default function Pad() {
  const [pressed, setPressed] = useState(false);
  const { tool, drawing, setDrawing, color } = useTools();
  const {
    points,
    vectors,
    addPoint,
    replaceLastPoint,
    clearPoints,
    savePointsVector
  } = useBoard();

  const onPointerDown = (e) => {
    if (tool === "select") return;
    tool === "path" && setPressed(true);
    tool === "line" && setDrawing(true);
    addPoint({ x: e.clientX, y: e.clientY });
  };

  const onPointerMove = (e) => {
    if (tool === "path" && pressed) {
      addPoint({
        x: e.clientX,
        y: e.clientY
      });
    } else if (tool === "line" && drawing) {
      replaceLastPoint({
        x: e.clientX,
        y: e.clientY
      });
    }
  };

  const onPointerUp = (e) => {
    if (tool === "path" && pressed) {
      savePointsVector("path", color);
      clearPoints();
      setPressed(false);
    }
  };

  const hasTempPath = points.length && pressed && tool === "path";
  const hasTempLine = points.length && drawing && tool === "line";

  return (
    <svg
      className="artboard"
      viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {hasTempPath && <PathElement />}
      {hasTempLine && <PolylineElement />}
      <g>
        {Object.values(vectors).map((v) => {
          switch (v.type) {
            case "line":
              return (
                <PolylineElement
                  key={v.createdAt}
                  points={v.points}
                  color={v.color}
                />
              );
            case "path":
            default:
              return (
                <PathElement
                  key={v.createdAt}
                  points={v.points}
                  color={v.color}
                />
              );
          }
        })}
      </g>
    </svg>
  );
}
