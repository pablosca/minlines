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

const initialState = {
  tool: null,
  color: "#000",
  drawing: false,
  selectedVector: null,
  selectionBox: null,
  isDragging: false
};

const ToolsContext = createContext(initialState);

export const ToolsProvider = ({ children }) => {
  const [tool, setTool] = useState(null);
  const [color, setColor] = useState(initialState.color);
  const [drawing, setDrawing] = useState(false);
  const [selectedVector, setSelectedVector] = useState(null);
  const [selectionBox, setSelectionBox] = useState(null);
  const [isDragging, setIsDragging] = useState(null);

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
        selectedVector,
        setSelectedVector,
        selectionBox,
        setSelectionBox,
        isDragging,
        setIsDragging
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
