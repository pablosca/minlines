import { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import useTools from './ToolsContext';
import PathElement from './PathElement';
import PolylineElement from './PolylineElement';
import TextElement from './TextElement';
import useSelection from './SelectionContext';
import RectangleElement from './RectangleElement';

export default function Element ({ vector, onPointerDown, onPointerUp }) {
  const { tool } = useTools();
  const { resizeStyle, selectedVectors, isResizing, dragStyle, isDragging, pointedVectorId, isSelectingArea } = useSelection();
  const elementRef = useRef(null);

  const isSelected = selectedVectors.includes(vector.createdAt);
  const isPointed = vector.createdAt === pointedVectorId;
  let style = null;

  if (isSelected && isResizing) style = resizeStyle;
  if ((isSelected || isPointed) && isDragging) style = dragStyle;

  return (
    <g
      style={style}
      dataselected={selectedVectors}
      className={tool === 'select' ? 'selectable' : ''}
      ref={elementRef}
      onPointerDown={onPointerDown(vector)}
      onPointerUp={onPointerUp}
    >
      {isSelected && isSelectingArea && <rect
        x={vector.box.x}
        y={vector.box.y}
        width={vector.box.width}
        height={vector.box.height}
        stroke="blue"
        strokeOpacity=".75"
        strokeDasharray="4"
        fill="none"
      />}
      {vector.type === 'polyline' && (
        <PolylineElement
          key={vector.createdAt}
          points={vector.points}
          strokeColor={vector.strokeColor}
          strokeWidth={vector.strokeWidth}
          strokeOpacity={vector.strokeOpacity}
          strokeLinecap={vector.strokeLinecap}
          vectorId={vector.createdAt}
        />
      )}
      {vector.type === 'path' && (
        <PathElement
          key={vector.createdAt}
          points={vector.points}
          strokeColor={vector.strokeColor}
          strokeWidth={vector.strokeWidth}
          strokeOpacity={vector.strokeOpacity}
          strokeLinecap={vector.strokeLinecap}
          vectorId={vector.createdAt}
        />
      )}
      {vector.type === 'rectangle' && (
        <RectangleElement
          key={vector.createdAt}
          strokeColor={vector.strokeColor}
          strokeWidth={vector.strokeWidth}
          strokeOpacity={vector.strokeOpacity}
          fillColor={vector.fillColor}
          fillOpacity={vector.fillOpacity}
          vectorId={vector.createdAt}
          cornerRadius={vector.cornerRadius}
          box={vector.box}
        />
      )}
      {/* {vector.type === "text" && (
        <TextElement
          key={vector.createdAt}
          data={vector}
        />
      )} */}
    </g>
  );
}

Element.propTypes = {
  vector: PropTypes.object,
  onPointerDown: PropTypes.func,
  onPointerUp: PropTypes.func,
};
