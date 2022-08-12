import useTools, { colors } from "./ToolsContext";

export default function ColorPicker() {
  const { strokeColor, setStrokeColor } = useTools();

  const onColorClick = (code) => {
    setStrokeColor(code);
  };

  return (
    <div className="color-picker toolbar">
      {colors.map((c) => (
        <button
          className={`color picker-button ${strokeColor === c.code && 'active'}`}
          style={{ "--color": c.code }}
          key={c.name}
          onClick={(e) => onColorClick(c.code)}
          title={c.name}
        ></button>
      ))}
    </div>
  );
}
