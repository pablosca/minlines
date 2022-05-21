import { createContext, useContext, useReducer } from "react";

import useBoard from "./BoardContext";

const SELECTION_PADDING = 20;

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
        selectedVector: null,
        selectionBox: null,
        selectionRect: null
      };
    case "START_RESIZE":
      return {
        ...state,
        isResizing: true,
        initialResizeRect: { ...state.selectionRect }
      };
    case "RESIZE":
      const { initialResizeRect } = state;
      const { x, y, width, height } = initialResizeRect;
      const { resizingCoords } = payload;
      const newSelectionRect = {
        x: resizingCoords.x,
        y: resizingCoords.y,
        width: width + x - resizingCoords.x,
        height: height + y - resizingCoords.y
      };
      const scaleX =
        (newSelectionRect.width - SELECTION_PADDING) /
        (width - SELECTION_PADDING);
      const scaleY =
        (newSelectionRect.height - SELECTION_PADDING) /
        (height - SELECTION_PADDING);

      return {
        ...state,
        resizingCoords,
        selectionRect: newSelectionRect,
        resizeStyle: {
          transform: `scale(${scaleX}, ${scaleY})`,
          transformOrigin: "right bottom",
          transformBox: "fill-box"
        }
      };
    case "STOP_RESIZE":
      return {
        ...state,
        resizingCoords: null,
        isResizing: false,
        resizeStyle: null,
        initialResizeCoords: null
      };
    default:
      return state;
  }
}

const initialSelectState = {
  selectionBox: null,
  selectionRect: null,
  selectedVector: null,
  isResizing: false,
  resizingCoords: null,
  resizeStyle: null
};

const SelectionContext = createContext(initialSelectState);

export const SelectionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(selectReducer, initialSelectState);
  const { updatePointsVectorResize } = useBoard();

  const value = {
    isResizing: state.isResizing,
    resizingCoords: state.resizingCoords,
    resizeStyle: state.resizeStyle,
    selectionRect: state.selectionRect,
    selectedVector: state.selectedVector,

    select: (payload) => {
      const { selectedVector, box } = payload;
      const { x, y, width, height } = box;
      const selectionRect = {
        x: x - SELECTION_PADDING / 2,
        y: y - SELECTION_PADDING / 2,
        width: width + SELECTION_PADDING,
        height: height + SELECTION_PADDING
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
      dispatch({ type: "DESELECT" });
    },

    startResize: () => {
      dispatch({ type: "START_RESIZE" });
    },

    resize: (resizingCoords) => {
      dispatch({
        type: "RESIZE",
        payload: { resizingCoords }
      });
    },

    completeResize: () => {
      const { selectedVector, selectionBox, resizingCoords } = state;

      if (selectedVector && selectionBox && resizingCoords) {
        updatePointsVectorResize(selectedVector, {
          scaleX: (selectionBox.width + resizingCoords.x) / selectionBox.width,
          scaleY: (selectionBox.height + resizingCoords.y) / selectionBox.height
        });
      }

      dispatch({ type: "STOP_RESIZE" });
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
