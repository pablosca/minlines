import useTools, { colors } from "./ToolsContext";

export default function ColorPicker() {
  const { color, setColor } = useTools();

  const onColorClick = (code) => {
    setColor(code);
  };

  return (
    <div className="color-picker toolbar">
      {colors.map((c) => (
        <button
          className={`color picker-button ${color === c.code && 'active'}`}
          style={{ "--color": c.code }}
          key={c.name}
          onClick={(e) => onColorClick(c.code)}
          title={c.name}
        ></button>
      ))}
    </div>
  );
}
