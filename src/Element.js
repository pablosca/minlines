import { useRef, useState } from "react";
import useTools from "./ToolsContext";
import PathElement from "./PathElement";
import PolylineElement from "./PolylineElement";

export default function Element({ vector }) {
  const { drawing, color, tool } = useTools();
  const isDragging = useRef(null);
  const initialCoords = useRef(null);
  const [draggingCoords, setDraggingCoords] = useState({});

  const onPointerMove = (e) => {
    if (drawing || (!isDragging && !initialCoords.current)) return;

    setDraggingCoords({
      x: e.clientX - initialCoords.current.x,
      y: e.clientY - initialCoords.current.y
    });
  };

  const onPointerUp = (e) => {
    isDragging.current = false;
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);
  };

  const onPointerDown = (e) => {
    if (tool !== "select") return;
    console.log("POINTER DOWN", e.currentTarget);
    e.stopPropagation();
    isDragging.current = true;
    initialCoords.current = { x: e.clientX, y: e.clientY };

    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
  };

  const style = {};

  if (draggingCoords) {
    style.transform = `translate(${draggingCoords.x}px, ${draggingCoords.y}px)`;
  }

  return (
    <g style={style} onPointerDown={onPointerDown}>
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
