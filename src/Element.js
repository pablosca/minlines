import { useCallback, useEffect, useRef, useState } from "react";
import useTools from "./ToolsContext";
import PathElement from "./PathElement";
import PolylineElement from "./PolylineElement";
import useBoard from "./BoardContext";
import useSelection from "./SelectionContext";

export default function Element({ vector }) {
  const {
    tool,
    selectedVector,
    setSelectedVector,
    isDragging,
    setIsDragging
  } = useTools();
  const { setSelectionBox, updateSelection } = useSelection();
  const { updatePointsVector } = useBoard();
  const initialCoords = useRef(null);
  const draggingCoords = useRef(null);
  const [style, setStyle] = useState();
  const elementRef = useRef(null);
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

  const onClick = useCallback(() => {
    setSelectedVector(vector.createdAt);
  }, [setSelectedVector, vector]);

  const onPointerDown = (e) => {
    if (tool !== "select") return;

    e.stopPropagation();
    setIsDragging(true);
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

    setIsDragging(false);

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
    updateSelection(elementRef.current.querySelector(".vector").getBBox());
  };

  useEffect(() => {
    console.log("AA");
    if (isSelected) {
      updateBoxRect();
    } else {
      updateSelection(null);
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
