import useBoard from "./BoardContext";
import useTools, { tools } from "./ToolsContext";

export default function ToolBar() {
  const { tool, selectTool, drawing, setDrawing, strokeColor, strokeWidth } = useTools();
  const { clearPoints, savePointsVector, clearLastPoint } = useBoard();

  const onToolClick = (e, t) => {
    clearPoints();
    selectTool(t === tool ? null : t);
  };

  const onDoneClick = async (e) => {
    e.stopPropagation();
    await clearLastPoint();
    await savePointsVector({ type: "polyline", strokeColor, strokeWidth });
    setDrawing(false);
    clearPoints();
  };

  return (
    <nav className="toolbar">
      {tools.map((t) => (
        <button
          onClick={(e) => onToolClick(e, t.key)}
          key={t.key}
          className={`button ${t.key === tool ? 'selected' : ''}`}
        >
          {t.name}
        </button>
      ))}
      {drawing && <button className="button" onClick={onDoneClick}>Done</button>}
    </nav>
  );
}
