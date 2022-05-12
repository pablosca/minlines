import useBoard from "./BoardContext";
import useTools from "./ToolsContext";

export default function PathElement(props) {
  const { points } = useBoard();
  const { color } = useTools();
  const renderedPoints = props.points || points;
  const renderedColor = props.color || color;
  const pointsString = renderedPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <path
      className="vector"
      fill="none"
      stroke={renderedColor}
      strokeWidth="2"
      d={`M${pointsString}`}
    />
  );
}
