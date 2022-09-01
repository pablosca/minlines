import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import useBoard from './BoardContext';
import useTools, { tools } from './ToolsContext';

export default function ToolBar () {
  const { tool, selectTool, drawing, setDrawing, strokeColor, strokeWidth } = useTools();
  const { clearPoints, savePointsVector, clearLastPoint } = useBoard();

  const onToolClick = (key) => {
    return _ => {
      clearPoints();
      selectTool(key);
    };
  };

  const onDoneClick = async (e) => {
    e.stopPropagation();
    await clearLastPoint();
    await savePointsVector({ type: 'polyline', strokeColor, strokeWidth });
    setDrawing(false);
    clearPoints();
  };

  return (
    <nav className="toolbar">
      <div className="toolbar-main">
        {tools.map((t) => (
          <button
            onClick={onToolClick(t.key)}
            key={t.key}
            className={`button light ${t.key === tool ? 'selected' : ''}`}
          >
            <FontAwesomeIcon icon={t.icon} size="lg" />
          </button>
        ))}
      </div>
      {drawing && <button className="button accent toolbar-done" onClick={onDoneClick}>
        <FontAwesomeIcon icon="check" size="xl" />
      </button>}
    </nav>
  );
}
