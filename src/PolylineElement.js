import useSelection from "./SelectionContext";
import useTools from "./ToolsContext";

export default function PolylineElement({ points, strokeColor, drawing, strokeWidth, id, vectorId }) {
  const { tool } = useTools();
  const pointsString = points.map((p) => `${p.x},${p.y}`).join(" ");
  const { selectedVectors, isSelectingArea } = useSelection();
  const isSelected = selectedVectors.includes(vectorId);

  return (
    <g>
      {drawing &&
        points.map((p) => (
          <circle
            className="point-handler"
            cx={p.x}
            cy={p.y}
            key={p.ts}
          ></circle>
        ))}
      {tool === "select" && (
        <polyline
          className={`grabbable ${(isSelected && isSelectingArea) && 'active'}`}
          strokeWidth={strokeWidth + 6}
          points={`${pointsString}`}
          vectorEffect="non-scaling-stroke"
        />
      )}
      <polyline
        id={id}
        fill="none"
        className="vector"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        points={`${pointsString}`}
        vectorEffect="non-scaling-stroke"
      />
    </g>
  );
}
