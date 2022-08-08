import { useCallback, useEffect, useRef, useState } from "react";
import useTools from "./ToolsContext";
import PathElement from "./PathElement";
import PolylineElement from "./PolylineElement";
import TextElement from "./TextElement";
import useSelection from "./SelectionContext";

export default function Element({ vector, onPointerDown, onPointerUp }) {
  const { tool } = useTools();
  const { resizeStyle, selectedVectors, select, isResizing, dragStyle, isDragging, pointedVectorId } = useSelection();
  const elementRef = useRef(null);

  const isSelected = selectedVectors.includes(vector.createdAt);
  const isPointed = vector.createdAt === pointedVectorId;
  let style = null;

  if (isSelected && isResizing) style = resizeStyle;
  if ((isSelected || isPointed) && isDragging) style = dragStyle;

  // const onClick = useCallback((e) => {
  //   e.stopPropagation();

  //   if (tool !== "select" || isDragging || isSelected) return; // Fix this so we don't need the 'isSelected' flag here and we can deselect by clicking the selected element itself
  //   select({
  //     box: elementRef.current.querySelector(".vector").getBoundingClientRect(),
  //     newSelectedId: vector.createdAt,
  //   });
  // }, [tool, vector, select]);

  return (
    <g
      style={style}
      dataselected={selectedVectors}
      className={tool === "select" ? "selectable" : ""}
      ref={elementRef}
      onPointerDown={onPointerDown(vector)}
      onPointerUp={onPointerUp}
    >
      {vector.type === "polyline" && (
        <PolylineElement
          key={vector.createdAt}
          points={vector.points}
          color={vector.color}
          strokeWidth={vector.strokeWidth}
        />
      )}
      {vector.type === "path" && (
        <PathElement
          key={vector.createdAt}
          points={vector.points}
          color={vector.color}
          strokeWidth={vector.strokeWidth}
        />
      )}
      {/* {vector.type === "text" && (
        <TextElement
          key={vector.createdAt}
          data={vector}
        />
      )} */}
    </g>
  );
}
