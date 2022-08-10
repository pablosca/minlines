import { useCallback, useEffect, useRef, useState } from "react";
import useTools from "./ToolsContext";
import Element from "./Element";
import PathElement from "./PathElement";
import PolylineElement from "./PolylineElement";
import TextElement from "./TextElement";
import SelectionWrapper from "./SelectionWrapper";
import Sidebar from "./Sidebar";
import useBoard from "./BoardContext";
import useSelection from "./SelectionContext";

export default function Pad() {
  const [pressed, setPressed] = useState(false);
  const { tool, drawing, setDrawing, color, strokeWidth, withGrid } = useTools();
  const {
    points,
    vectors,
    addPoint,
    replaceLastPoint,
    clearPoints,
    savePointsVector,
    removeVector,
    tempText,
    setTempText,
    saveTextVector,
  } = useBoard();
  const {
    selectionBox,
    selectedVectors,
    deselect,
    isResizing,
    resize,
    completeResize,
    pointVector,
    drag,
    unPointVector,
    isDragging,
    initialCoords,
    pointedVectorId,
    select,
    isShiftOn,
    isSelectingArea,
    startSelectArea,
    moveSelectArea,
    stopSelectArea,
  } = useSelection();

  const onPadPointerDown = (e, vector) => {
    if (!tool) return;
    tool === "path" && setPressed(true);
    tool === "polyline" && setDrawing(true);

    if (tool.match(/path|polyline/)) {
      addPoint({ x: e.clientX, y: e.clientY });
    }

    if (tool === 'select') {
      startSelectArea({
        selectionBox: {
          x: e.clientX,
          y: e.clientY,
        },
      });
    }
  };

  const onPadPointerMove = (e) => {
    if (tool === "select") {
      if (pointedVectorId) {
        drag({
          x: e.clientX - initialCoords.x,
          y: e.clientY - initialCoords.y
        });
      } else if (isResizing) {
        resize({
          x: e.clientX,
          y: e.clientY
        });
      } else if (isSelectingArea) {
        moveSelectArea({
          x: e.clientX,
          y: e.clientY,
        });
      }
    } else if (tool === "path" && pressed) {
      console.log('EE',e);
      addPoint({
        x: e.clientX,
        y: e.clientY
      });
    } else if (tool === "polyline" && drawing) {
      replaceLastPoint({
        x: e.clientX,
        y: e.clientY
      });
    }
  };

  const onPadPointerUp = async (e) => {
    if (tool === 'select') {
      if (isResizing) {
        completeResize();
      } else if (!isDragging && !isSelectingArea || !selectionBox) {
        deselect();
      } else if (isSelectingArea) {
        await stopSelectArea();
      }
    } else if (tool === "path" && pressed) {
      savePointsVector({
        type: "path",
        color,
        strokeWidth,
      });
      clearPoints();
      setPressed(false);
    } else if (tool === 'text') {
      setTempText({ x: e.clientX, y: e.clientY, content: '' });
    }
  };

  // Element's pointer events, TODO: put this in the Element component itself?
  const onElementPointerDown = useCallback(
    (vector) => (e) => {
      e.stopPropagation();

      const isSelected = selectedVectors.includes(vector.createdAt);

      if (!isSelected && !isShiftOn) {
        deselect();
      }

      pointVector({
        initialCoords: {
          x: e.clientX,
          y: e.clientY
        },
        type: vector.type,
        pointedVectorId: vector.createdAt,
      });
    }, [tool, isShiftOn, selectedVectors]);

  const onElementPointerUp = (e) => {
      if (isSelectingArea && selectionBox) return;

      e.stopPropagation();
      if (tool !== "select") return;

      const isPointedVectorSelected = selectedVectors.includes(pointedVectorId);

      if (pointedVectorId) unPointVector();
      if (!isPointedVectorSelected && !isResizing && !isSelectingArea) {
        select({ newSelectedId: pointedVectorId });
      }

      if (isResizing) {
        completeResize();
      }
    };

  const deleteVector = useCallback(
    (e) => {
      if (![8, 46].includes(e.keyCode)) return;
      if (tool !== "select" && !selectedVectors.length) return;

      removeVector(selectedVectors);
      deselect();
    },
    [tool, selectedVectors, removeVector]
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
      deselect();
    }
  }, [tool]);

  const hasTempPath = points.length && pressed && tool === "path";
  const hasTempLine = points.length && drawing && tool === "polyline";
  const hasTempText = tempText && tool === "text";

  const onTextChange = useCallback((e) => {
    setTempText({ ...tempText, content: e.currentTarget.value });
  });

  const onTextBlur = useCallback(e => {
    const { x, y, content } = tempText;
    saveTextVector({
      x,
      y,
      content,
      color,
      fontSize: 16,
    });
  });
  
  return (
    <main className="main">
      {tempText && <textarea
        style={{ 'position': 'fixed', left: tempText.x + 'px', top: tempText.y + 'px', background: 'red', opacity: 0.01 }}
        autoFocus
        onChange={onTextChange}
        onBlur={onTextBlur}
        value={tempText.content}
      />}

      <svg
        className={`artboard ${withGrid && 'with-grid'}`}
        viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}
        onPointerDown={onPadPointerDown}
        onPointerMove={onPadPointerMove}
        onPointerUp={onPadPointerUp}
      >
        {/* TODO: Instead of using id, use a global ref? */}
        {hasTempPath && <PathElement id="temp-element" />}
        {hasTempLine && (
          <PolylineElement
            id="temp-element"
            drawing={drawing}
            points={points}
            color={color}
            strokeWidth={strokeWidth}
          />
        )}

        {/* {hasTempText && <TextElement id="temp-element" data={tempText} />} */}

        {!isDragging && selectionBox && <SelectionWrapper />}

        <g>
          {Object.values(vectors).map((v) => (
            <Element
              key={v.createdAt}
              vector={v}
              onPointerDown={onElementPointerDown}
              onPointerUp={onElementPointerUp}
            />
          ))}
        </g>
      </svg>
      <Sidebar />
    </main>
  );
}
