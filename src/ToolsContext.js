import { useState, createContext, useContext } from "react";

export const tools = [
  {
    name: "Path",
    key: "path"
  },
  {
    name: "Polyline",
    key: "polyline"
  },
  {
    name: "Rectangle",
    key: "rectangle"
  },
  {
    name: "Select",
    key: "select"
  },
  // {
  //   name: "Text",
  //   key: "text"
  // },
];

export const colors = [
  {
    name: "Black",
    code: "#000000"
  },
  {
    name: "Red",
    code: "#ff0000"
  },
  {
    name: "Green",
    code: "#00ff00"
  },
  {
    name: "Blue",
    code: "#0000ff"
  }
];

export const strokeWidths = [
  {
    name: "Extra small",
    width: 1
  },
  {
    name: "Small",
    width: 2
  },
  {
    name: "Medium",
    width: 4
  },
  {
    name: "Large",
    width: 6
  },
  {
    name: "Extra large",
    width: 10
  }
];

const initialState = {
  tool: 'path',
  strokeColor: "#000",
  drawing: false,
  isDragging: false,
  strokeWidth: 2,
  withGrid: true,
};

const ToolsContext = createContext(initialState);

export const ToolsProvider = ({ children }) => {
  const [tool, setTool] = useState(initialState.tool);
  const [strokeColor, setStrokeColor] = useState(initialState.strokeColor);
  const [drawing, setDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(null);
  const [strokeWidth, setStrokeWidth] = useState(initialState.strokeWidth);
  const [withGrid, setWithGrid] = useState(initialState.withGrid);

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
        withGrid,
        setWithGrid,
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
