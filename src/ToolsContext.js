import { useState, createContext, useContext } from "react";

export const tools = [
  {
    name: "Path",
    key: "path"
  },
  {
    name: "Line",
    key: "line"
  },
  {
    name: "Select",
    key: "select"
  }
];

export const colors = [
  {
    name: "Black",
    code: "#000"
  },
  {
    name: "Red",
    code: "#f00"
  },
  {
    name: "Green",
    code: "#0F0"
  },
  {
    name: "Blue",
    code: "#00F"
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
  tool: null,
  color: "#000",
  drawing: false,
  isDragging: false,
  strokeWidth: 2,
  withGrid: false,
};

const ToolsContext = createContext(initialState);

export const ToolsProvider = ({ children }) => {
  const [tool, setTool] = useState(null);
  const [color, setColor] = useState(initialState.color);
  const [drawing, setDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(null);
  const [strokeWidth, setStrokeWidth] = useState(initialState.strokeWidth);
  const [withGrid, setWithGrid] = useState(false);

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
        color,
        setColor,
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
