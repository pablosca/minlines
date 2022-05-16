import { useEffect, useState, useRef } from "react";
import useSelection from "./SelectionContext";

export default function SelectionWrapper() {
  const { setResizingCoords, selectionRect, resizingCoords } = useSelection();
  const isResizing = useRef(null);
  const [rect, setRect] = useState(selectionRect);

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
    isResizing.current = false;

    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);
  };

  useEffect(() => {
    console.log(isResizing && selectionRect && resizingCoords);
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

  const { x, y, height, width } = rect;

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
