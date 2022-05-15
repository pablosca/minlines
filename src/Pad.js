import { useCallback, useEffect, useState } from "react";
import useTools from "./ToolsContext";
import Element from "./Element";
import PathElement from "./PathElement";
import PolylineElement from "./PolylineElement";
import SelectionWrapper from "./SelectionWrapper";
import useBoard from "./BoardContext";

export default function Pad() {
  const [pressed, setPressed] = useState(false);
  const {
    tool,
    drawing,
    setDrawing,
    color,
    selectedVector,
    selectionBox,
    isDragging,
    setSelectedVector
  } = useTools();
  const { removeVector } = useBoard();
  const {
    points,
    vectors,
    addPoint,
    replaceLastPoint,
    clearPoints,
    savePointsVector
  } = useBoard();

  const onPointerDown = (e) => {
    if (tool === "select") return;
    tool === "path" && setPressed(true);
    tool === "line" && setDrawing(true);
    addPoint({ x: e.clientX, y: e.clientY });
  };

  const onPointerMove = (e) => {
    if (tool === "path" && pressed) {
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
    if (tool === "path" && pressed) {
      savePointsVector("path", color);
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
    if (tool !== "select") {
      setSelectedVector(null);
    }
  }, [tool, setSelectedVector]);

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
        <PolylineElement drawing={drawing} points={points} color={color} />
      )}

      {selectedVector && !isDragging && selectionBox && <SelectionWrapper />}

      <g>
        {Object.values(vectors).map((v) => (
          <Element key={v.createdAt} vector={v} />
        ))}
      </g>
    </svg>
  );
}
