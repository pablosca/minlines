import useTools, { strokeWidths } from "./ToolsContext";

export default function StrokeWidthPicker() {
  const { strokeWidth, setStrokeWidth } = useTools();

  const onStrokeClick = (width) => {
    setStrokeWidth(width);
  };

  return (
    <div className="stroke-picker toolbar">
      {strokeWidths.map((s) => (
        <button
          className={`picker-button ${strokeWidth === s.width && 'active'}`}
          key={s.name}
          onClick={(e) => onStrokeClick(s.width)}
          title={s.name}
        >
          <div className="stroke" style={{ "--stroke-width": s.width }}></div>
        </button>
      ))}
    </div>
  );
}
