import { useState } from "react";
import useTools from "./ToolsContext";
import Element from "./Element";
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

  return (
    <svg
      className="artboard"
      viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <Element vector={{ type: tool, points }} />
      <g>
        {Object.values(vectors).map((v) => (
          <Element key={v.createdAt} vector={v} />
        ))}
      </g>
    </svg>
  );
}
