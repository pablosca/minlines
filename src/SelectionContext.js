import { createContext, useContext, useEffect, useReducer, useState } from "react";

import useBoard from "./BoardContext";

function selectReducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case "SELECT":
      return {
        ...state,
        selectedVectors: payload.selectedVectors,
        selectionBox: payload.selectionBox,
      };
    case "DESELECT":
      return {
        ...state,
        selectedVectors: [],
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
  selectedVectors: [],
  isResizing: false,
  resizingCoords: null,
  resizeStyle: null,
  corners: null,
  isShiftOn: false,
};

const SelectionContext = createContext(initialSelectState);

export const SelectionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(selectReducer, initialSelectState);
  const [isShiftOn, setIsShiftOn] = useState(false);
  const { updateVectorResize } = useBoard();

  const value = {
    isResizing: state.isResizing,
    resizingCoords: state.resizingCoords,
    resizeStyle: state.resizeStyle,
    selectedVectors: state.selectedVectors,
    selectionBox: state.selectionBox,

    select: (payload) => {
      let { selectedVectors, box } = payload;
      let { x: newX1, y: newY1, width: newWidth, height: newHeight } = box;
      let newX2 = newX1 + newWidth;
      let newY2 = newY1 + newHeight;

      if (state.selectionBox) {
        const { x: currentX1, y: currentY1, width: currentWidth, height: currentHeight } = state.selectionBox;
        const currentX2 = currentX1 + currentWidth;
        const currentY2 = currentY1 + currentHeight;
  
        // check if boundaries are further than those in the state
        // otherwise keep what we have
        if (newX1 > currentX1) newX1 = currentX1;
        if (newX2 < currentX2) newX2 = currentX2;;
        if (newY1 > currentY1) newY1 = currentY1;
        if (newY2 < currentY2) newY2 = currentY2;;
      }

      if (isShiftOn) {
        selectedVectors = [...new Set([...state.selectedVectors, ...selectedVectors])];
      }

      dispatch({
        type: "SELECT",
        payload: {
          selectedVectors,
          selectionBox: {
            x: newX1,
            y: newY1,
            width: newX2 - newX1,
            height: newY2 - newY1,
          },
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
        selectedVectors,
        isResizing,
        initialResizeRect,
        selectionBox,
        corners,
        resizeStyle,
      } = state;

      if (selectedVectors.length && isResizing) {
        updateVectorResize(selectedVectors, {
          scaleX: selectionBox.width / initialResizeRect.width,
          scaleY: selectionBox.height / initialResizeRect.height,
          selectionBox,
          corners,
          resizeStyle,
        });
      }

      dispatch({ type: "STOP_RESIZE" });
    }
  };

  // TODO: put this in a more global context (WindowContext?)
  useEffect(() => {
    const onShiftChange = (e) => setIsShiftOn(e.shiftKey);

    window.addEventListener('keyup', onShiftChange);
    window.addEventListener('keydown', onShiftChange);

    return () => {
      window.removeEventListener('keyup', onShiftChange);
      window.removeEventListener('keydown', onShiftChange);
    }
  }, []);

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
