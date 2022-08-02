import { useCallback } from "react";
import useSelection from "./SelectionContext";

export default function SelectionWrapper() {
  const { selectionBox, startResize } = useSelection();
  const { x, y, width, height } = selectionBox;

  const onPointerDown = useCallback(
    (e) => {
      e.stopPropagation();

      startResize();
    },
    [startResize]
  );

  return (
    <g>
      {/*<circle className="point-handler left-top" cx={x} cy={y}></circle>
      <circle
        className="point-handler right-top"
        cx={x + width}
        cy={y}
      ></circle>
      <circle
        className="point-handler left-bottom"
        cx={x}
        cy={y + height}
  ></circle>*/}
      <circle
        className="point-handler right-bottom"
        cx={x + width}
        cy={y + height}
        onPointerDown={onPointerDown}
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
