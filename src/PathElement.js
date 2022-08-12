import useBoard from "./BoardContext";
import useTools from "./ToolsContext";
import useSelection from "./SelectionContext";

export default function PathElement(props) {
  const { points } = useBoard();
  const { strokeColor, strokeWidth, tool } = useTools();
  const renderedPoints = props.points || points;
  const renderedStrokeColor = props.strokeColor || strokeColor;
  const renderedStrokeWidth = props.strokeWidth || strokeWidth;
  const pointsString = renderedPoints.map((p) => `${p.x},${p.y}`).join(" ");
  const { selectedVectors, isSelectingArea } = useSelection();
  const isSelected = selectedVectors.includes(props.vectorId);

  return (
    <g>
      {tool === "select" && (
        <path
          className={`grabbable ${(isSelected && isSelectingArea) && 'active' }`}
          strokeWidth={renderedStrokeWidth + 6}
          d={`M${pointsString}`}
          vectorEffect="non-scaling-stroke"
        />
      )}
      <path
        id={props.id}
        className="vector"
        fill="none"
        stroke={renderedStrokeColor}
        strokeWidth={renderedStrokeWidth}
        d={`M${pointsString}`}
        vectorEffect="non-scaling-stroke"
      />
    </g>
  );
}
