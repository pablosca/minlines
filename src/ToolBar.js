import useBoard from "./BoardContext";
import useTools, { tools } from "./ToolsContext";

export default function ToolBar() {
  const { tool, selectTool, drawing, setDrawing, color } = useTools();
  const { clearPoints, savePointsVector, clearLastPoint } = useBoard();

  const onToolClick = (e, t) => {
    clearPoints();
    selectTool(t === tool ? null : t);
  };

  const onDoneClick = (e) => {
    e.stopPropagation();
    clearLastPoint();
    savePointsVector("line", color);
    setDrawing(false);
    clearPoints();
  };

  return (
    <nav className="toolbar">
      {tools.map((t) => (
        <button
          onClick={(e) => onToolClick(e, t.key)}
          key={t.key}
          className={t.key === tool ? "selected" : ""}
        >
          {t.name}
        </button>
      ))}
      {drawing && <button onClick={onDoneClick}>Done</button>}
    </nav>
  );
}
