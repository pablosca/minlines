import { useEffect, useRef, useState } from "react";
import useTools from "./ToolsContext";
import PathElement from "./PathElement";
import PolylineElement from "./PolylineElement";
import useBoard from "./BoardContext";

export default function Element({ vector }) {
  const { tool, selectedVector, setSelectedVector } = useTools();
  const { updatePointsVector } = useBoard();
  const isDragging = useRef(null);
  const initialCoords = useRef(null);
  const draggingCoords = useRef(null);
  const [style, setStyle] = useState();
  const elementRef = useRef(null);
  const [boxRect, setBoxRect] = useState(null);
  const isSelected = selectedVector === vector.createdAt;

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

  const onClick = () => {
    setSelectedVector(vector.createdAt);
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

  const onPointerUp = async (e) => {
    //toggleSelectedVector(vector.createdAt);

    isDragging.current = false;

    if (draggingCoords.current) {
      updatePointsVector(vector.createdAt, {
        deltaX: draggingCoords.current.x,
        deltaY: draggingCoords.current.y
      });

      updatePosition(null);
    }

    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);
  };

  const updateBoxRect = () => {
    // TODO: do this better and check unnecesary calls
    // TODO: fix slight flashing of wrong position
    setBoxRect(elementRef.current.querySelector(".vector").getBBox());
  };

  useEffect(() => {
    if (isSelected) {
      updateBoxRect();
    } else {
      //isSelected.current = false;
      console.log("box rect null");
      setBoxRect(null);
    }
  }, [isSelected, vector]);

  return (
    <g
      style={style}
      className={tool === "select" ? "selectable" : ""}
      onPointerDown={onPointerDown}
      ref={elementRef}
      onClick={onClick}
    >
      {isSelected && !isDragging.current && boxRect && (
        <rect
          x={boxRect.x - 10}
          y={boxRect.y - 10}
          width={boxRect.width + 20}
          height={boxRect.height + 20}
          stroke="blue"
          strokeOpacity=".4"
          fill="none"
        ></rect>
      )}
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
