import useTools from './ToolsContext';
import useSelection from './SelectionContext';
import PropTypes from 'prop-types';

export default function RectangleElement (props) {
  const { strokeColor, strokeWidth, tool } = useTools();
  const renderedStrokeColor = props.strokeColor || strokeColor;
  const renderedFillColor = props.fillColor || '#999999';
  const renderedStrokeWidth = isNaN(props.strokeWidth) ? strokeWidth : props.strokeWidth;
  const { selectedVectors, isSelectingArea } = useSelection();
  const isSelected = selectedVectors.includes(props.vectorId);
  const { x, y, height, width } = props.box;

  return (
    <g>
      {tool === 'select' && (
        <rect
          className={`grabbable ${(isSelected && isSelectingArea) && 'active'}`}
          x={x}
          y={y}
          width={width}
          height={height}
          strokeWidth={renderedStrokeWidth + 6}
          rx={props.cornerRadius || 0}
          vectorEffect="non-scaling-stroke"
        />
      )}
      <rect
        id={props.id}
        className="vector"
        x={x}
        y={y}
        width={width}
        height={height}
        stroke={renderedStrokeColor}
        strokeWidth={renderedStrokeWidth}
        strokeOpacity={props.strokeOpacity || 1}
        fill={renderedFillColor}
        fillOpacity={props.fillOpacity || 0.5}
        rx={props.cornerRadius || 0}
        vectorEffect="non-scaling-stroke"
      />
    </g>
  );
}

RectangleElement.propTypes = {
  strokeColor: PropTypes.string,
  fillColor: PropTypes.string,
  strokeWidth: PropTypes.number,
  strokeOpacity: PropTypes.number,
  fillOpacity: PropTypes.number,
  vectorId: PropTypes.number,
  id: PropTypes.string,
  box: PropTypes.object,
  cornerRadius: PropTypes.number,
};
