import { useCallback, useEffect, useRef, useState } from "react";
import useTools from "./ToolsContext";
import PathElement from "./PathElement";
import PolylineElement from "./PolylineElement";
import TextElement from "./TextElement";
import useSelection from "./SelectionContext";

export default function Element({ vector, onPointerDown, onPointerUp }) {
  const { tool } = useTools();
  const { resizeStyle, selectedVectors, isResizing, dragStyle, isDragging, pointedVectorId, isSelectingArea } = useSelection();
  const elementRef = useRef(null);

  const isSelected = selectedVectors.includes(vector.createdAt);
  const isPointed = vector.createdAt === pointedVectorId;
  let style = null;

  if (isSelected && isResizing) style = resizeStyle;
  if ((isSelected || isPointed) && isDragging) style = dragStyle;

  return (
    <g
      style={style}
      dataselected={selectedVectors}
      className={tool === "select" ? "selectable" : ""}
      ref={elementRef}
      onPointerDown={onPointerDown(vector)}
      onPointerUp={onPointerUp}
    >
      {isSelected && isSelectingArea && <rect
        x={vector.box.x}
        y={vector.box.y}
        width={vector.box.width}
        height={vector.box.height}
        stroke="blue"
        strokeOpacity=".75"
        strokeDasharray="4"
        fill="none"
      />}
      {vector.type === "polyline" && (
        <PolylineElement
          key={vector.createdAt}
          points={vector.points}
          color={vector.color}
          strokeWidth={vector.strokeWidth}
          vectorId={vector.createdAt}
        />
      )}
      {vector.type === "path" && (
        <PathElement
          key={vector.createdAt}
          points={vector.points}
          color={vector.color}
          strokeWidth={vector.strokeWidth}
          vectorId={vector.createdAt}
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
