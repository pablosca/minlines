import { useCallback, useEffect, useState } from "react";
import useTools from "./ToolsContext";
import Element from "./Element";
import PathElement from "./PathElement";
import PolylineElement from "./PolylineElement";
import SelectionWrapper from "./SelectionWrapper";
import useBoard from "./BoardContext";
import useSelection from "./SelectionContext";
import useDrag from "./DragContext";

export default function Pad() {
  const { drag, completeDrag, isDragging, initialCoords } = useDrag();
  const [pressed, setPressed] = useState(false);
  const { tool, drawing, setDrawing, color, strokeWidth } = useTools();
  const {
    points,
    vectors,
    addPoint,
    replaceLastPoint,
    clearPoints,
    savePointsVector,
    removeVector
  } = useBoard();
  const {
    selectionBox,
    selectedVector,
    deselect,
    isResizing,
    resize,
    completeResize
  } = useSelection();

  const onPointerDown = (e, vector) => {
    if (!tool) return;
    tool === "path" && setPressed(true);
    tool === "line" && setDrawing(true);

    if (tool.match(/path|line/)) {
      addPoint({ x: e.clientX, y: e.clientY });
    }
  };

  const onPointerMove = (e) => {
    if (tool === "select") {
      if (isDragging && initialCoords) {
        drag({
          x: e.clientX - initialCoords.x,
          y: e.clientY - initialCoords.y
        });
      } else if (isResizing) {
        resize({
          x: e.clientX,
          y: e.clientY
        });
      }
    } else if (tool === "path" && pressed) {
      addPoint({
        x: e.clientX,
        y: e.clientY
      });
    } else if (tool === "line" && drawing) {
      replaceLastPoint({
        x: e.clientX,
        y: e.clientY
      });
    }
  };

  const onPointerUp = (e) => {
    if (tool === "select") {
      if (isDragging) {
        completeDrag();
      } else if (isResizing) {
        completeResize();
      }
    } else if (tool === "path" && pressed) {
      savePointsVector({ type: "path", color, strokeWidth });
      clearPoints();
      setPressed(false);
    }
  };

  const deleteVector = useCallback(
    (e) => {
      if (![8, 46].includes(e.keyCode)) return;
      if (tool !== "select" && !selectedVector) return;

      removeVector(selectedVector);
    },
    [tool, selectedVector, removeVector]
  );

  useEffect(() => {
    document.addEventListener("keyup", deleteVector);

    return () => {
      document.removeEventListener("keyup", deleteVector);
    };
  }, [deleteVector]);

  // TODO: put this in a better place
  useEffect(() => {
    if (tool !== "select") deselect();
  }, [tool]);

  const hasTempPath = points.length && pressed && tool === "path";
  const hasTempLine = points.length && drawing && tool === "line";
  
  return (
    <svg
      className="artboard"
      viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {hasTempPath && <PathElement />}
      {hasTempLine && (
        <PolylineElement drawing={drawing} points={points} color={color} strokeWidth={strokeWidth} />
      )}

      {!isDragging && selectionBox && <SelectionWrapper />}

      <g>
        {Object.values(vectors).map((v) => (
          <Element key={v.createdAt} vector={v} />
        ))}
      </g>
    </svg>
  );
}
