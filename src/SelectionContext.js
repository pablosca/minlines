import { createContext, useContext, useEffect, useReducer, useState } from "react";

import useBoard from "./BoardContext";

function selectReducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case "SHIFT_CHANGE": {
      return {
        ...state,
        isShiftOn: payload.isShiftOn,
      };
    }
    case "SELECT": {
      return {
        ...state,
        selectedVectors: payload.selectedVectors,
        selectionBox: payload.selectionBox,
      };
    }
    case "UPDATE_SELECTION_BOX": {
      return {
        ...state,
        selectionBox: payload.selectionBox,
      };
    }
    case "DESELECT": {
      return {
        ...state,
        selectedVectors: [],
        selectionBox: null,
      };
    }
    case "START_RESIZE":
      return {
        ...state,
        isResizing: true,
        corners: payload.corners,
        initialResizeRect: { ...state.selectionBox }
      };
    case "RESIZE": {
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
    }
    case "STOP_RESIZE":
      return {
        ...state,
        resizingCoords: null,
        isResizing: false,
        resizeStyle: null,
        initialResizeCoords: null,
        corners: null,
      };
    case "DRAGGING": {
      const { x, y } = payload.draggingCoords;

      return {
        ...state,
        isDragging: true,
        draggingCoords: { x, y },
        dragStyle: {
          transform: `translate(${x}px, ${y}px)`
        },
      }
    }
    case "POINT_VECTOR": {
      return {
        ...state,
        initialCoords: payload.initialCoords,
        pointedVectorId: payload.pointedVectorId,
        type: payload.type,
      };
    }
    case "UNPOINT_VECTOR": {
      return {
        ...state,
        initialCoords: null,
        type: null,
        pointedVectorId: null,
      };
    }
    case "STOP_DRAG": {
      return {
        ...state,
        isDragging: false,
        draggingCoords: null,
        dragStyle: null,
      };
    }
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
  // dragging:
  isDragging: false,
  initialCoords: null,
  draggingCoords: null,
  dragStyle: null,
  pointedVectorId: null,
};

const SelectionContext = createContext(initialSelectState);

export const SelectionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(selectReducer, initialSelectState);
  const { vectors, updateVectorResize, updateVectorPosition } = useBoard();

  const setShift = (isShiftOn) => {
    dispatch({
      type: 'SHIFT_CHANGE',
      payload: { isShiftOn }
    });
  };

  const value = {
    isShiftOn: state.isShiftOn,
    isResizing: state.isResizing,
    resizingCoords: state.resizingCoords,
    resizeStyle: state.resizeStyle,
    selectedVectors: state.selectedVectors,
    selectionBox: state.selectionBox,
    isDragging: state.isDragging,
    initialCoords: state.initialCoords,
    draggingCoords: state.draggingCoords,
    dragStyle: state.dragStyle,
    pointedVectorId: state.pointedVectorId,

    select: (payload) => {
      const { newSelectedId } = payload;
      const { box } = vectors[newSelectedId];
      let { x: newX1, y: newY1, width: newWidth, height: newHeight } = box;
      let newX2 = newX1 + newWidth;
      let newY2 = newY1 + newHeight;
      let newSelectedVectors = [newSelectedId];
      let newSelectionBox = box;

      if (state.selectionBox) {
        const { x: currentX1, y: currentY1, width: currentWidth, height: currentHeight } = state.selectionBox;
        const currentX2 = currentX1 + currentWidth;
        const currentY2 = currentY1 + currentHeight;
  
        // check if boundaries are further than those in the state
        // otherwise keep what we have
        if (newX1 > currentX1) newX1 = currentX1;
        if (newX2 < currentX2) newX2 = currentX2;
        if (newY1 > currentY1) newY1 = currentY1;
        if (newY2 < currentY2) newY2 = currentY2;

        newSelectionBox = {
          x: newX1,
          y: newY1,
          width: newX2 - newX1,
          height: newY2 - newY1,
        };
      }

      if (state.isShiftOn) {
        console.log('SELECT IS SHIFT ON', state.isShiftOn);
        newSelectedVectors = [...new Set([...state.selectedVectors, newSelectedId])];
      }

      dispatch({
        type: "SELECT",
        payload: {
          selectedVectors: newSelectedVectors,
          selectionBox: newSelectionBox,
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

    completeResize: async () => {
      const {
        selectedVectors,
        isResizing,
        initialResizeRect,
        selectionBox,
        corners,
        resizeStyle,
      } = state;

      if (selectedVectors.length && isResizing) {
        await updateVectorResize({
          scaleX: selectionBox.width / initialResizeRect.width,
          scaleY: selectionBox.height / initialResizeRect.height,
          selectionBox,
          corners,
          resizeStyle,
          selectedVectors,
        });
      }

      dispatch({ type: "STOP_RESIZE" });
    },

    pointVector: ({ initialCoords, type, pointedVectorId }) => {
      dispatch({
        type: "POINT_VECTOR",
        payload: {
          initialCoords,
          type,
          pointedVectorId,
        }
      });
    },

    unPointVector: async () => {
      const { draggingCoords, selectedVectors, isDragging, pointedVectorId } = state;
      const vector = vectors[pointedVectorId];

      if ((selectedVectors.length || pointedVectorId) && draggingCoords) {
        const idsToChange = selectedVectors.length ? selectedVectors : [pointedVectorId];

        await updateVectorPosition({
          idsToChange,
          deltaX: draggingCoords.x,
          deltaY: draggingCoords.y,
        });
      }

      dispatch({ type: "UNPOINT_VECTOR" });
      
      if (isDragging) {
        const isPointedVectorSelected = selectedVectors.includes(pointedVectorId);
        let newSelectionBox = vector.box;

        dispatch({ type: "STOP_DRAG" });
        

        if (state.selectionBox) {
          newSelectionBox = {
            ...state.selectionBox,
            x: state.selectionBox.x + draggingCoords.x,
            y: state.selectionBox.y + draggingCoords.y,
          }
        } else {
          newSelectionBox = {
            ...vector.box,
            x: vector.box.x + draggingCoords.x,
            y: vector.box.y + draggingCoords.y,
          };
        }

        dispatch({
          type: "UPDATE_SELECTION_BOX",
          payload: {
            selectionBox: newSelectionBox,
          }
        });
      }
    },

    drag: (draggingCoords) => {
      dispatch({
        type: "DRAGGING",
        payload: { draggingCoords }
      });
    },
  };

  // TODO: put this in a more global context (WindowContext?)
  useEffect(() => {
    const onShiftChange = (e) => setShift(e.shiftKey);

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
