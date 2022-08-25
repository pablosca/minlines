import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import useBoard from "./BoardContext";
import useTools, { tools } from "./ToolsContext";

export default function ToolBar() {
  const { tool, selectTool, drawing, setDrawing, strokeColor, strokeWidth, zoom } = useTools();
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
      <div className="toolbar-main">
        {tools.map((t) => (
          <button
            onClick={(e) => onToolClick(e, t.key)}
            key={t.key}
            className={`button light ${t.key === tool ? 'selected' : ''}`}
          >
            <FontAwesomeIcon icon={t.icon} size="lg" />
          </button>
        ))}
      </div>
      {
        drawing && <button className="button accent toolbar-done" onClick={onDoneClick}>
          <FontAwesomeIcon icon="check" size="xl" />
        </button>
      }
      
      {zoom.scale !== 0 && `${ parseInt(100 / zoom.scale) }%`}
    </nav>
  );
}
