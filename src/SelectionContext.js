import { createContext, useContext, useReducer } from "react";

import useBoard from "./BoardContext";

function selectReducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case "SELECT":
      return {
        ...state,
        selectedVector: payload.selectedVector,
        selectionBox: payload.selectionBox,
      };
    case "DESELECT":
      return {
        ...state,
        selectedVector: null,
        selectionBox: null,
      };
    case "START_RESIZE":
      return {
        ...state,
        isResizing: true,
        corners: payload.corners,
        initialResizeRect: { ...state.selectionBox }
      };
    case "RESIZE":
      const { initialResizeRect, corners } = state;
      const { x, y, width, height } = initialResizeRect;
      const { resizingCoords } = payload;
      const newSelectionBox = {
        x: corners.right ? x : resizingCoords.x,
        y: corners.bottom ? y : resizingCoords.y,
        width: corners.right ? resizingCoords.x - x : x + width - resizingCoords.x,
        height: corners.bottom ? resizingCoords.y - y : y + height - resizingCoords.y
      };

      const scaleX = newSelectionBox.width / width;
      const scaleY = newSelectionBox.height / height;

      return {
        ...state,
        resizingCoords,
        selectionBox: newSelectionBox,
        resizeStyle: {
          transform: `scale(${scaleX}, ${scaleY})`,
          transformOrigin: `${corners.right ? 'left' : 'right'} ${corners.bottom ? 'top' : 'bottom'}`,
          transformBox: "fill-box"
        }
      };
    case "STOP_RESIZE":
      return {
        ...state,
        resizingCoords: null,
        isResizing: false,
        resizeStyle: null,
        initialResizeCoords: null,
        corners: null,
      };
    default:
      return state;
  }
}

const initialSelectState = {
  selectionBox: null,
  selectedVector: null,
  isResizing: false,
  resizingCoords: null,
  resizeStyle: null,
  corners: null,
};

const SelectionContext = createContext(initialSelectState);

export const SelectionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(selectReducer, initialSelectState);
  const { updatePointsVectorResize } = useBoard();

  const value = {
    isResizing: state.isResizing,
    resizingCoords: state.resizingCoords,
    resizeStyle: state.resizeStyle,
    selectedVector: state.selectedVector,
    selectionBox: state.selectionBox,

    select: (payload) => {
      const { selectedVector, box } = payload;
      const { x, y, width, height } = box;

      dispatch({
        type: "SELECT",
        payload: {
          selectedVector: selectedVector,
          selectionBox: { x, y, width, height },
        }
      });
    },

    deselect: () => {
      dispatch({ type: "DESELECT" });
    },

    startResize: (corners) => {
      dispatch({
        type: "START_RESIZE",
        payload: { corners }
      });
    },

    resize: (resizingCoords) => {
      dispatch({
        type: "RESIZE",
        payload: { resizingCoords }
      });
    },

    completeResize: () => {
      const {
        selectedVector,
        isResizing,
        initialResizeRect,
        selectionBox,
        corners
      } = state;

      if (selectedVector && isResizing) {
        updatePointsVectorResize(selectedVector, {
          scaleX: selectionBox.width / initialResizeRect.width,
          scaleY: selectionBox.height / initialResizeRect.height,
          selectionBox,
          corners,
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
