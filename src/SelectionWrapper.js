import { useEffect, useState, useRef } from "react";
import useBoard from "./BoardContext";
import useSelection from "./SelectionContext";

export default function SelectionWrapper() {
  const {
    setResizingCoords,
    selectionRect,
    resizingCoords,
    selectedVector,
    selectionBox
  } = useSelection();
  const { updatePointsVectorResize } = useBoard();
  const isResizing = useRef(null);
  const [rect, setRect] = useState(selectionRect);

  const { x, y, height, width } = rect;

  const startResize = (e) => {
    e.stopPropagation();
    isResizing.current = true;

    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
  };

  const onPointerMove = (e) => {
    if (!isResizing.current) return;
    setResizingCoords({
      x: x - e.clientX,
      y: y - e.clientY
    });
  };

  const onPointerUp = (e) => {
    if (selectedVector && selectionBox && resizingCoords) {
      updatePointsVectorResize(selectedVector, {
        scaleX: (selectionBox.width + resizingCoords.x) / selectionBox.width,
        scaleY: (selectionBox.height + resizingCoords.y) / selectionBox.height
      });
      setResizingCoords(null);
    }

    isResizing.current = false;

    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);
  };

  useEffect(() => {
    if (isResizing.current && selectionRect && resizingCoords) {
      setRect({
        x: selectionRect.x - resizingCoords.x,
        y: selectionRect.y - resizingCoords.y,
        width: selectionRect.width + resizingCoords.x,
        height: selectionRect.height + resizingCoords.y
      });
    } else {
      setRect(selectionRect);
    }
  }, [isResizing, selectionRect, resizingCoords]);

  return (
    <g>
      <circle
        onPointerDown={startResize}
        className="point-handler left-top"
        cx={x}
        cy={y}
      ></circle>
      <circle
        className="point-handler right-top"
        cx={x + width}
        cy={y}
      ></circle>
      <circle
        className="point-handler left-bottom"
        cx={x}
        cy={y + height}
      ></circle>
      <circle
        className="point-handler right-bottom"
        cx={x + width}
        cy={y + height}
      ></circle>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        stroke="blue"
        strokeOpacity=".4"
        fill="none"
      ></rect>
    </g>
  );
}
