import useBoard from "./BoardContext";
import useTools from "./ToolsContext";

export default function PathElement(props) {
  const { points } = useBoard();
  const { color, strokeWidth, tool } = useTools();
  const renderedPoints = props.points || points;
  const renderedColor = props.color || color;
  const renderedStrokeWidth = props.strokeWidth || strokeWidth;
  const pointsString = renderedPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <g>
      {tool === "select" && (
        <path
          className="grabbable"
          strokeWidth="8"
          d={`M${pointsString}`}
          vectorEffect="non-scaling-stroke"
        />
      )}
      <path
        className="vector"
        fill="none"
        stroke={renderedColor}
        strokeWidth={renderedStrokeWidth}
        d={`M${pointsString}`}
        vectorEffect="non-scaling-stroke"
      />
    </g>
  );
}
