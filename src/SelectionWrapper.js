import { useCallback } from "react";
import useSelection from "./SelectionContext";

export default function SelectionWrapper() {
  const { selectionBox, startResize } = useSelection();
  const { x, y, width, height } = selectionBox;

  const onPointerDown = useCallback(
    (corners) =>
    (e) => {
      e.stopPropagation();

      startResize(corners);
    },
    [startResize]
  );

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        stroke="blue"
        strokeOpacity=".4"
        fill="none"
      ></rect>
      <circle
        className="point-handler left-top"
        cx={x}
        cy={y}
        onPointerDown={onPointerDown({ left: true, top: true })}
      ></circle>
      <circle
        className="point-handler right-top"
        cx={x + width}
        cy={y}
        onPointerDown={onPointerDown({ right: true, top: true })}
      ></circle>
      <circle
        className="point-handler left-bottom"
        cx={x}
        cy={y + height}
        onPointerDown={onPointerDown({ left: true, bottom: true })}
      ></circle>
      <circle
        className="point-handler right-bottom"
        cx={x + width}
        cy={y + height}
        onPointerDown={onPointerDown({ right: true, bottom: true })}
      ></circle>
    </g>
  );
}
