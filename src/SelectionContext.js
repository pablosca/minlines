import {
  useState,
  createContext,
  useContext,
  useEffect,
  useReducer
} from "react";

function selectReducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case "SELECT":
      return {
        ...state,
        selectedVector: payload.selectedVector,
        selectionBox: payload.selectionBox,
        selectionRect: payload.selectionRect
      };
    case "DESELECT":
      return {
        ...state,
        selectedVectorId: null,
        selectionBox: null
      };
    default:
      return state;
  }
}

const initialState = {
  isResizing: false,
  resizingCoords: null,
  resizingStyle: null
};

const initialSelectState = {
  selectionBox: null,
  selectionRect: null,
  selectedVector: null
};

const SelectionContext = createContext(initialState);

export const SelectionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(selectReducer, initialSelectState);
  const [isResizing, setIsResizing] = useState(false);
  const [resizingCoords, setResizingCoords] = useState(null);
  const [resizingStyle, setResizingStyle] = useState(null);

  useEffect(() => {
    const { selectionBox } = state;
    if (resizingCoords && selectionBox) {
      const scaleX =
        (selectionBox.width + resizingCoords.x) / selectionBox.width;
      const scaleY =
        (selectionBox.height + resizingCoords.y) / selectionBox.height;

      setResizingStyle({
        transform: `scale(${scaleX}, ${scaleY})`,
        transformOrigin: "right bottom",
        transformBox: "fill-box"
      });
    } else {
      setResizingStyle(null);
    }
  }, [resizingCoords, state]);

  const value = {
    isResizing,
    setIsResizing,
    resizingCoords,
    setResizingCoords,
    resizingStyle,
    setResizingStyle,
    selectionRect: state.selectionRect,

    select: (payload) => {
      const { selectedVector, box } = payload;
      const { x, y, width, height } = box;
      const selectionRect = {
        x: x - 10,
        y: y - 10,
        width: width + 20,
        height: height + 20
      };

      dispatch({
        type: "SELECT",
        payload: {
          selectedVector: selectedVector,
          selectionBox: { x, y, width, height },
          selectionRect: selectionRect
        }
      });
    },

    deselect: () => {
      dispatch({
        type: "DESELECT",
        payload: {
          selectedVector: null,
          selectionBox: null,
          selectionRect: null
        }
      });
    }
  };

  return (
    <SelectionContext.Provider value={value}>
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
