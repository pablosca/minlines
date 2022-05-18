import { useCallback, useEffect, useRef } from "react";
import useTools from "./ToolsContext";
import PathElement from "./PathElement";
import PolylineElement from "./PolylineElement";
import useSelection from "./SelectionContext";
import useDrag from "./DragContext";

export default function Element({ vector }) {
  const { style: dragStyle, startDrag, vectorId } = useDrag();
  const { tool } = useTools();
  const {
    updateSelection,
    resizingStyle,
    selectedVector,
    setSelectedVector,
    clearSelection
  } = useSelection();
  const elementRef = useRef(null);
  const isSelected = selectedVector === vector.createdAt;

  const onClick = useCallback(() => {
    clearSelection();
    setSelectedVector(vector.createdAt);
  }, [setSelectedVector, vector, clearSelection]);

  const onPointerDown = useCallback(
    (e) => {
      if (tool !== "select") return;

      e.stopPropagation();

      startDrag({
        initialCoords: {
          x: e.clientX,
          y: e.clientY
        },
        vectorId: vector.createdAt
      });
    },
    [tool, vector]
  );

  const updateBoxRect = () => {
    // TODO: do this better and check unnecesary calls
    updateSelection(elementRef.current.querySelector(".vector").getBBox());
  };

  useEffect(() => {
    if (isSelected) {
      updateBoxRect();
    } else {
      updateSelection(null);
    }
  }, [isSelected, vector, resizingStyle]);

  return (
    <g
      style={
        (vectorId === vector.createdAt && dragStyle) ||
        (isSelected ? resizingStyle : null)
      }
      className={tool === "select" ? "selectable" : ""}
      ref={elementRef}
      onClick={onClick}
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
