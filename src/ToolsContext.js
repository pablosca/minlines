import { useState, createContext, useContext } from 'react';
import PropTypes from 'prop-types';

export const tools = [
  {
    name: 'Path',
    key: 'path',
    icon: 'pencil'
  },
  {
    name: 'Polyline',
    key: 'polyline',
    icon: 'pen-nib'
  },
  {
    name: 'Rectangle',
    key: 'rectangle',
    icon: 'vector-square'
  },
  {
    name: 'Select',
    key: 'select',
    icon: 'arrow-pointer'
  }
  // {
  //   name: "Text",
  //   key: "text"
  // },
];

export const defaultFillColor = '#63d99c';

const initialState = {
  tool: 'path',
  strokeColor: '#ae00ff',
  drawing: false,
  isDragging: false,
  strokeWidth: 3,
  zoom: { x: 0, y: 0, scale: 1 },
};

const ToolsContext = createContext(initialState);

export const ToolsProvider = ({ children }) => {
  const [tool, setTool] = useState(initialState.tool);
  const [strokeColor, setStrokeColor] = useState(initialState.strokeColor);
  const [drawing, setDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(null);
  const [strokeWidth, setStrokeWidth] = useState(initialState.strokeWidth);
  const [zoom, setZoom] = useState(initialState.zoom);

  const selectTool = (tool) => {
    setDrawing(false);
    setTool(tool);
  };

  return (
    <ToolsContext.Provider
      value={{
        tool,
        selectTool,
        drawing,
        setDrawing,
        strokeColor,
        setStrokeColor,
        isDragging,
        setIsDragging,
        strokeWidth,
        setStrokeWidth,
        zoom,
        setZoom,
      }}
    >
      {children}
    </ToolsContext.Provider>
  );
};

ToolsProvider.propTypes = {
  children: PropTypes.element,
};

const useTools = () => {
  const context = useContext(ToolsContext);

  if (context === undefined) {
    throw new Error('useTools must be used within a ToolsProvider');
  }
  return context;
};

export default useTools;
