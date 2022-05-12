import { useState } from "react";
import useBoard from "./BoardContext";
import useTools from "./ToolsContext";

export default function PolylineElement(props) {
  const { drawing, color, tool } = useTools();
  const { points } = useBoard();
  const [isDragging, setIsDragging] = useState(false);
  const [initialRect, setInitialRect] = useState({});
  const [draggingCoords, setDraggingCoords] = useState({});
  const renderedPoints = props.points || points;
  const renderedColor = props.color || color;
  const pointsString = renderedPoints.map((p) => `${p.x},${p.y}`).join(" ");

  const onPointerMove = (e) => {
    if (drawing || (!isDragging && !initialRect)) return;

    setDraggingCoords({
      x: e.clientX - initialRect.x,
      y: e.clientY - initialRect.y
    });
  };

  const onPointerUp = (e) => {
    setIsDragging(false);
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);
  };

  const onPointerDown = (e) => {
    if (tool !== "select") return;
    console.log("POINTER DOWN", e.currentTarget);
    e.stopPropagation();
    setIsDragging(true);
    setInitialRect({ x: e.clientX, y: e.clientY });

    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
  };

  const style = {};

  if (draggingCoords) {
    style.transform = `translate(${draggingCoords.x}px, ${draggingCoords.y}px)`;
  }

  return (
    <g className={tool === "select" ? "selectable" : ""} style={style}>
      {drawing &&
        points.map((p) => (
          <circle
            fill="none"
            strokeWidth=".75"
            stroke="blue"
            cx={p.x}
            cy={p.y}
            r="4"
            key={p.ts}
          ></circle>
        ))}
      {tool === "select" && (
        <polyline
          fill="none"
          className="grabbable"
          stroke="transparent"
          strokeOpacity=".1"
          strokeWidth="6"
          points={`${pointsString}`}
          onPointerDown={onPointerDown}
        />
      )}
      <polyline
        fill="none"
        className="vector"
        stroke={renderedColor}
        strokeWidth="1"
        points={`${pointsString}`}
      />
    </g>
  );
}
