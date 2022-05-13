import { useState } from "react";
import useBoard from "./BoardContext";
import useTools from "./ToolsContext";

export default function PolylineElement(props) {
  const { drawing, color, tool } = useTools();
  const { points } = useBoard();
  const renderedPoints = props.points || points;
  const renderedColor = props.color || color;
  const pointsString = renderedPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <g className={tool === "select" ? "selectable" : ""}>
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
