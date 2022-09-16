import { useCallback, useEffect, useRef, useState } from 'react';
import useTools from './ToolsContext';
import Element from './Element';
import PathElement from './PathElement';
import PolylineElement from './PolylineElement';
import RectangleElement from './RectangleElement';
import TextElement from './TextElement';
import SelectionWrapper from './SelectionWrapper';
import Sidebar from './Sidebar';
import useBoard from './BoardContext';
import useSelection from './SelectionContext';

export default function Pad () {
  const artboard = useRef();
  const [pressed, setPressed] = useState(false);
  const { tool, drawing, setDrawing, strokeColor, strokeWidth, selectTool, zoom, setZoom } = useTools();
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
    tempShape,
    addShape,
    updateShape,
    saveShape,
    withGrid,
    lastCreatedVectorId,
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
    stopSelectArea
  } = useSelection();

  const onPadPointerDown = (e) => {
    if (!tool) return;
    tool.match(/path|rectangle/) && setPressed(true);
    tool === 'polyline' && setDrawing(true);

    if (tool.match(/path|polyline/)) {
      addPoint({ x: e.clientX, y: e.clientY });
    }

    if (tool.match(/rectangle/)) {
      addShape({ x: e.clientX, y: e.clientY });
    }

    if (tool === 'select') {
      startSelectArea({
        selectionBox: {
          x: e.clientX,
          y: e.clientY
        }
      });
    }
  };

  const onPadPointerMove = (e) => {
    if (tool === 'select') {
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
          y: e.clientY
        });
      }
    } else if (tool === 'path' && pressed) {
      addPoint({
        x: e.clientX,
        y: e.clientY
      });
    } else if (tool === 'polyline' && drawing) {
      replaceLastPoint({
        x: e.clientX,
        y: e.clientY
      });
    } else if (tool === 'rectangle' && pressed) {
      updateShape({
        x: e.clientX,
        y: e.clientY
      });
    }
  };

  const onPadPointerUp = async (e) => {
    if (document.activeElement.tagName === 'INPUT') return;
    if (tool === 'select') {
      if (isResizing) {
        completeResize();
      } else if (!isDragging && !isSelectingArea || !selectionBox) {
        deselect();
      } else if (isSelectingArea) {
        await stopSelectArea();
      }
    } else if (tool === 'path' && pressed) {
      savePointsVector({
        type: 'path',
        strokeColor,
        strokeWidth
      });
      clearPoints();
      setPressed(false);
    } else if (tool === 'text') {
      setTempText({ x: e.clientX, y: e.clientY, content: '' });
    } else if (tool === 'rectangle') {
      saveShape({
        type: 'rectangle',
        strokeColor,
        strokeWidth
      });
      setPressed(false);
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
        pointedVectorId: vector.createdAt
      });
    }, [tool, isShiftOn, selectedVectors]);

  const onElementPointerUp = (e) => {
    if (isSelectingArea && selectionBox) return;

    e.stopPropagation();
    if (tool !== 'select') return;

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
      if (tool !== 'select' && !selectedVectors.length) return;
      if (e.target.tagName === 'INPUT') return;

      removeVector(selectedVectors);
      deselect();
    },
    [tool, selectedVectors, removeVector]
  );

  useEffect(() => {
    document.addEventListener('keyup', deleteVector);
    const onPadWheel = e => {
      e.preventDefault();
      let newScale = zoom.scale - e.deltaY * -0.001;

      // Restrict scale
      newScale = Math.min(Math.max(0.5, newScale), 3);

      setZoom({ x: e.clientX, y: e.clientY, scale: Math.round(newScale * 100) / 100 });
      e.preventDefault();
    };

    // we need the passive: false
    artboard.current.addEventListener('wheel', onPadWheel, { passive: false });

    return () => {
      document.removeEventListener('keyup', deleteVector);
      artboard.current.removeEventListener('wheel', onPadWheel);
    };
  }, [deleteVector, artboard, zoom]);

  // TODO: put this in a better place
  useEffect(() => {
    if (tool !== 'select') {
      deselect();
    }
  }, [tool]);

  useEffect(() => {
    if (!lastCreatedVectorId) return;
    selectTool('select');
    select({ newSelectedId: lastCreatedVectorId });
  }, [lastCreatedVectorId]);

  const hasTempPath = points.length && pressed && tool === 'path';
  const hasTempLine = points.length && drawing && tool === 'polyline';
  const hasTempText = tempText && tool === 'text';
  const hasTempShape = tempShape && tool === 'rectangle';

  const onTextChange = useCallback((e) => {
    setTempText({ ...tempText, content: e.currentTarget.value });
  });

  const onTextBlur = useCallback(e => {
    const { x, y, content } = tempText;
    saveTextVector({
      x,
      y,
      content,
      strokeColor,
      fontSize: 16
    });
  });

  // const onPadTouchStart = useCallback(e => {
  //   if (e.touches.length === 2) {
  //     console.log('PINCH STARTED');
  //   }
  // });

  // const onPadTouchMove = useCallback(e => {
  //   var dist = Math.hypot(
  //     e.touches[0].pageX - e.touches[1].pageX,
  //     e.touches[0].pageY - e.touches[1].pageY);
  //   console.log('PINCH move', dist);
  // });

  // const onPadTouchEnd = useCallback(e => {
  //   console.log('PINCH end!');
  // });
  const viewBoxX = zoom.x ? zoom.x - zoom.x * zoom.scale : 0;
  const viewBoxY = zoom.y ? zoom.y - zoom.y * zoom.scale : 0;
  const viewBox = `${viewBoxX} ${viewBoxY} ${window.innerWidth * (zoom.scale)} ${window.innerHeight * zoom.scale}`;
  // scaleX * p.x + (1 - scaleX) * firstX

  return (
    <main className="main">
      {tempText && <textarea
        style={{ position: 'fixed', left: tempText.x + 'px', top: tempText.y + 'px', background: 'red', opacity: 0.01 }}
        autoFocus
        onChange={onTextChange}
        onBlur={onTextBlur}
        value={tempText.content}
      />}

      <svg
        className={`artboard ${tool && `tool tool-${tool}`} ${withGrid && 'with-grid'} ${isDragging && 'is-dragging'}`}
        viewBox={viewBox}
        width={window.innerWidth}
        height={window.innerHeight}
        onPointerDown={onPadPointerDown}
        onPointerMove={onPadPointerMove}
        onPointerUp={onPadPointerUp}
        ref={artboard}
        // onTouchStart={onPadTouchStart}
        // onTouchMove={onPadTouchMove}
        // onTouchEnd={onPadTouchEnd}
      >
        {/* TODO: Instead of using id, use a global ref? */}
        {hasTempPath && <PathElement id="temp-element" />}
        {hasTempLine && (
          <PolylineElement
            id="temp-element"
            drawing={drawing}
            points={points}
            strokeColor={strokeColor}
            strokeWidth={strokeWidth}
          />
        )}
        {hasTempShape && (
          <RectangleElement
            id="temp-element"
            drawing={drawing}
            box={tempShape}
          />
        )}

        {/* {hasTempText && <TextElement id="temp-element" data={tempText} />} */}

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

        {!isDragging && selectionBox && <SelectionWrapper />}
      </svg>
      <Sidebar />
    </main>
  );
}
