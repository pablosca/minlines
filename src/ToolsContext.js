import { useState, createContext, useContext } from "react";

export const tools = [
  {
    name: "Path",
    key: "path",
    icon: 'pencil',
  },
  {
    name: "Polyline",
    key: "polyline",
    icon: 'pen-nib',
  },
  {
    name: "Rectangle",
    key: "rectangle",
    icon: 'vector-square',
  },
  {
    name: "Select",
    key: "select",
    icon: 'arrow-pointer',
  },
  // {
  //   name: "Text",
  //   key: "text"
  // },
];

export const defaultFillColor = '#63d99c';

const initialState = {
  tool: 'path',
  strokeColor: "#ff8800",
  drawing: false,
  isDragging: false,
  strokeWidth: 6,
};

const ToolsContext = createContext(initialState);

export const ToolsProvider = ({ children }) => {
  const [tool, setTool] = useState(initialState.tool);
  const [strokeColor, setStrokeColor] = useState(initialState.strokeColor);
  const [drawing, setDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(null);
  const [strokeWidth, setStrokeWidth] = useState(initialState.strokeWidth);

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
      }}
    >
      {children}
    </ToolsContext.Provider>
  );
};

const useTools = () => {
  const context = useContext(ToolsContext);

  if (context === undefined) {
    throw new Error("useTools must be used within a ToolsProvider");
  }
  return context;
};

export default useTools;
