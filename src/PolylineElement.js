import useTools from "./ToolsContext";

export default function PolylineElement({ points, color, drawing, strokeWidth, id }) {
  const { tool } = useTools();
  const pointsString = points.map((p) => `${p.x},${p.y}`).join(" ");

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
          className="grabbable"
          strokeWidth={strokeWidth + 6}
          points={`${pointsString}`}
          vectorEffect="non-scaling-stroke"
        />
      )}
      <polyline
        id={id}
        fill="none"
        className="vector"
        stroke={color}
        strokeWidth={strokeWidth}
        points={`${pointsString}`}
        vectorEffect="non-scaling-stroke"
      />
    </g>
  );
}
