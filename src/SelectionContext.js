import { useState, createContext, useContext, useEffect } from "react";

const initialState = {
  isResizing: false,
  resizingCoords: null,
  resizingStyle: null,
  selectionBox: null
};

const SelectionContext = createContext(initialState);

export const SelectionProvider = ({ children }) => {
  const [isResizing, setIsResizing] = useState(false);
  const [resizingCoords, setResizingCoords] = useState(null);
  const [resizingStyle, setResizingStyle] = useState(null);
  const [selectionBox, setSelectionBox] = useState(null);
  const [selectionRect, setSelectionRect] = useState(null);

  const updateSelection = (box) => {
    setSelectionBox(box);

    if (box) {
      setSelectionRect({
        x: box.x - 10,
        y: box.y - 10,
        width: box.width + 20,
        height: box.height + 20
      });
    } else {
      setSelectionBox(null);
    }
  };

  useEffect(() => {
    if (resizingCoords && selectionRect) {
      const scaleX =
        (selectionBox.width + resizingCoords.x) / selectionBox.width;
      const scaleY =
        (selectionBox.height + resizingCoords.y) / selectionBox.height;

      console.log("SCALE X", scaleX);
      console.log("sele x", selectionRect.x);
      console.log("resi x", resizingCoords.x);
      console.log("width", selectionBox.width);

      setResizingStyle({
        transform: `scale(${scaleX}, ${scaleY})`,
        transformOrigin: "right bottom",
        transformBox: "fill-box"
      });
    } else {
      setResizingStyle(null);
    }
  }, [resizingCoords, selectionRect]);

  return (
    <SelectionContext.Provider
      value={{
        isResizing,
        setIsResizing,
        resizingCoords,
        setResizingCoords,
        resizingStyle,
        setResizingStyle,
        selectionBox,
        setSelectionBox,
        selectionRect,
        updateSelection
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
};

const useSelection = () => {
  const context = useContext(SelectionContext);

  if (context === undefined) {
    throw new Error("useSelection must be used within a SelectionProvider");
  }
  return context;
};

export default useSelection;
