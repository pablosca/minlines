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
