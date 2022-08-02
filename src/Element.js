import { useCallback, useEffect, useRef, useState } from "react";
import useTools from "./ToolsContext";
import PathElement from "./PathElement";
import PolylineElement from "./PolylineElement";
import useSelection from "./SelectionContext";
import useDrag from "./DragContext";

export default function Element({ vector }) {
  const { tool } = useTools();
  const { style: dragStyle, startDrag, vectorId: draggingVectorId, isDragging } = useDrag();
  const { resizeStyle, selectedVector, select, isResizing } = useSelection();
  const elementRef = useRef(null);

  const isSelected = selectedVector === vector.createdAt;
  const isElementDragging = draggingVectorId === vector.createdAt;
  let style = null;

  if (isSelected && isResizing) {
    style = resizeStyle;
  }

  if (isDragging && isElementDragging) {
    style = dragStyle;
  }

  const onClick = useCallback(() => {
    if (tool !== "select") return;

    select({
      box: elementRef.current.querySelector(".vector").getBBox(),
      selectedVector: vector.createdAt
    });
  }, [tool, vector, select]);

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

  // const updateBoxRect = () => {
  //   // TODO: do this better and check unnecesary calls
  //   updateSelection(elementRef.current.querySelector(".vector").getBBox());
  // };

  // useEffect(() => {
  //   if (isSelected) {
  //     updateBoxRect();
  //   } else {
  //     updateSelection(null);
  //   }
  // }, [isSelected, vector, resizeStyle]);

  return (
    <g
      style={style}
      dataselected={selectedVector}
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
