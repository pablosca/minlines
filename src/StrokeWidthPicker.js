import useTools, { strokeWidths } from "./ToolsContext";

export default function StrokeWidthPicker() {
  const { setStrokeWidth } = useTools();

  const onStrokeClick = (width) => {
    setStrokeWidth(width);
  };

  return (
    <div className="stroke-picker toolbar">
      {strokeWidths.map((c) => (
        <button
          className="picker-button"
          key={c.name}
          onClick={(e) => onStrokeClick(c.width)}
          title={c.name}
        >
          <div className="stroke" style={{ "--stroke-width": c.width }}></div>
        </button>
      ))}
    </div>
  );
}
