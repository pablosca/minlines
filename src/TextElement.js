import useTools from './ToolsContext';
import PropTypes from 'prop-types';

export default function TextElement ({ data, id }) {
  const { tool } = useTools();
  const lines = data.content.split('\n');

  return (
    <g>
      {/* {tool === "select" && (
        <text className="grabbable" x={data.x} y={data.y} style={{ 'fontSize': data.fontSize + 5 + 'px' }}>
          {lines.length <= 1 ? data.content : lines.map((line, index) => (
            //TODO: Fix multiple empty lines
            <tspan key={index} x={data.x} dy={index === 0 ? '0' : '1.2em'}>{line || ' '}</tspan>
          ))}
        </text>
      )} */}
      <text
        id={id}
        className={`vector ${tool === 'select' && 'grabbable'}`}
        x={data.x}
        y={data.y}
        style={{ fontSize: data.fontSize + 'px', transformBox: data.resizeStyle?.transformBox }}
        transform={data.resizeStyle?.transform}
        transformorigin={data.resizeStyle?.transformOrigin}
      >
        {lines.length <= 1 ? data.content : lines.map((line, index) => (
          // TODO: Fix multiple empty lines
          <tspan key={index} x={data.x} dy={index === 0 ? '0' : '1.2em'}>{line || ' '}</tspan>
        ))}
      </text>
    </g>
  );
}

TextElement.propTypes = {
  data: PropTypes.object,
  id: PropTypes.number,
};
