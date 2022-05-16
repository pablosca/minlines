import { useCallback } from "react";
import useSelection from "./SelectionContext";

export default function SelectionWrapper() {
  const {
    isResizing,
    setIsResizing,
    setResizingCoords,
    selectionRect,
    resizingStyle
  } = useSelection();
  const { x, y, width, height } = selectionRect;

  const onPointerDown = useCallback(
    (e) => {
      e.stopPropagation();
      setIsResizing(true);

      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
    },
    [setIsResizing]
  );

  const onPointerMove = (e) => {
    if (!isResizing) return;

    setResizingCoords({
      x: x - e.clientX,
      y: y - e.clientY
    });
  };

  const onPointerUp = (e) => {
    setIsResizing(false);

    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);
  };

  return (
    <g style={resizingStyle}>
      {isResizing && (
        <text x={x + 50} y={y + 50}>
          is resizing
        </text>
      )}
      <circle
        onPointerDown={onPointerDown}
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
