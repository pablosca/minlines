import { useRef, useState } from "react";
import useTools from "./ToolsContext";
import PathElement from "./PathElement";
import PolylineElement from "./PolylineElement";
import useBoard from "./BoardContext";

export default function Element({ vector }) {
  const { tool } = useTools();
  const { updatePointsVector } = useBoard();
  const isDragging = useRef(null);
  const initialCoords = useRef(null);
  const draggingCoords = useRef(null);
  const [style, setStyle] = useState();

  const updatePosition = (coords) => {
    if (coords) {
      setStyle({
        transform: `translate(${coords.x}px, ${coords.y}px)`
      });
    } else {
      setStyle(null);
    }

    draggingCoords.current = coords;
  };

  const onPointerDown = (e) => {
    if (tool !== "select") return;

    e.stopPropagation();
    isDragging.current = true;
    initialCoords.current = { x: e.clientX, y: e.clientY };

    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
  };

  const onPointerMove = (e) => {
    if (!isDragging && !initialCoords.current) return;

    updatePosition({
      x: e.clientX - initialCoords.current.x,
      y: e.clientY - initialCoords.current.y
    });
  };

  const onPointerUp = (e) => {
    isDragging.current = false;

    if (!draggingCoords.current) return;

    updatePointsVector(vector.createdAt, {
      deltaX: draggingCoords.current.x,
      deltaY: draggingCoords.current.y
    });

    updatePosition(null);

    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);
  };

  return (
    <g
      style={style}
      className={tool === "select" ? "selectable" : ""}
      onPointerDown={onPointerDown}
    >
      {vector.type === "line" && (
        <PolylineElement
          key={vector.createdAt}
          points={vector.points}
          color={vector.color}
        />
      )}
      {vector.type === "path" && (
        <PathElement
          key={vector.createdAt}
          points={vector.points}
          color={vector.color}
        />
      )}
    </g>
  );
}
