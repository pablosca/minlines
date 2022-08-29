import useSelection from './SelectionContext';
import useTools from './ToolsContext';
import PropTypes from 'prop-types';

export default function PolylineElement (props) {
  const { points, strokeColor, drawing, strokeWidth, id, vectorId, strokeOpacity } = props;
  const { tool } = useTools();
  const pointsString = points.map((p) => `${p.x},${p.y}`).join(' ');
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
      {tool === 'select' && (
        <polyline
          className={`grabbable ${(isSelected && isSelectingArea) && 'active'}`}
          strokeWidth={strokeWidth + 6}
          points={`${pointsString}`}
          vectorEffect="non-scaling-stroke"
          pointerEvents="stroke"
        />
      )}
      <polyline
        id={id}
        fill="none"
        className="vector"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeOpacity={strokeOpacity || 1}
        points={`${pointsString}`}
        vectorEffect="non-scaling-stroke"
      />
    </g>
  );
}

PolylineElement.propTypes = {
  points: PropTypes.array,
  strokeColor: PropTypes.string,
  drawing: PropTypes.bool,
  strokeWidth: PropTypes.number,
  id: PropTypes.string,
  vectorId: PropTypes.any, // TODO: change this to number (right now, it's undefined when created)
  strokeOpacity: PropTypes.number,
};
