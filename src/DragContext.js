import { useReducer, createContext, useContext } from "react";
import useBoard from "./BoardContext";

function dragReducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case "START_DRAG":
      return {
        ...state,
        isDragging: true,
        initialCoords: payload.initialCoords,
        vectorId: payload.vectorId,
        type: payload.type,
      };
    case "DRAGGING":
      const { x, y } = payload.draggingCoords;
      return {
        ...state,
        draggingCoords: payload.draggingCoords,
        style: {
          transform: `translate(${x}px, ${y}px)`
        }
      };
    case "STOP_DRAG":
      return {
        ...state,
        isDragging: false,
        initialCoords: null,
        draggingCoords: null,
        vectorId: null,
        style: null,
        type: null,
      };
    default:
      return state;
  }
}

const initialState = {
  isDragging: false,
  initialCoords: null,
  draggingCoords: null,
  style: null,
  vectorId: null
};

const DragContext = createContext(initialState);

export const DragProvider = ({ children }) => {
  const { updatePointsVectorDelta, updateVectorDelta } = useBoard();
  const [state, dispatch] = useReducer(dragReducer, initialState);

  const value = {
    isDragging: state.isDragging,
    initialCoords: state.initialCoords,
    draggingCoords: state.draggingCoords,
    style: state.style,
    vectorId: state.vectorId,
    startDrag: (payload) => {
      dispatch({
        type: "START_DRAG",
        payload: {
          initialCoords: payload.initialCoords,
          vectorId: payload.vectorId,
          type: payload.type,
        }
      });
    },

    drag: (draggingCoords) => {
      dispatch({
        type: "DRAGGING",
        payload: { draggingCoords }
      });
    },

    completeDrag: () => {
      const { vectorId, draggingCoords, type } = state;

      if (vectorId) {
        if (type.match(/polyline|path/) && draggingCoords) {
          updatePointsVectorDelta(vectorId, {
            deltaX: draggingCoords.x,
            deltaY: draggingCoords.y
          });
        }

        if (type === 'text' && draggingCoords) {
          updateVectorDelta(vectorId, {
            deltaX: draggingCoords.x,
            deltaY: draggingCoords.y
          });
        }
      }


      dispatch({
        type: "STOP_DRAG"
      });
    }
  };

  return <DragContext.Provider value={value}>{children}</DragContext.Provider>;
};

const useDrag = () => {
  const context = useContext(DragContext);

  if (context === undefined) {
    throw new Error("useDrag must be used within a DragProvider");
  }
  return context;
};

export default useDrag;
