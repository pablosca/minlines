import { useState, createContext, useContext, useRef } from "react";
import useSelection from "./SelectionContext";

/*type Vector = {
  points?: Array,
  createdAt: number,
  type: string
};*/

const initialState = {
  points: [],
  vectors: {},
  tempText: null,
};

const BoardContext = createContext(initialState);

export const BoardProvider = ({ children }) => {
  const [points, setPoints] = useState([]);
  const [vectors, setVectors] = useState({});
  const [tempText, setTempText] = useState(null);

  const clearPoints = () => setPoints([]);

  const addPoint = ({ x, y }) => {
    points.push({ x, y, ts: Date.now() });

    setPoints([...points]);
  };

  const replaceLastPoint = ({ x, y }) => {
    points.splice(points.length - 1 || 1, 1, {
      x,
      y,
      ts: Date.now()
    });

    setPoints([...points]);
  };

  const clearPointByIndex = (index) => {
    points.splice(index, 1);
    setPoints([...points]);
  };

  const clearLastPoint = () => {
    clearPointByIndex(points.length - 1);
  };

  const savePointsVector = ({ type, color, strokeWidth }) => {
    // TODO: Use a useRef, instead of using the id
    const tempElement = document.getElementById('temp-element');
    const { x, y, height, width } = tempElement.getBoundingClientRect();
    const now = Date.now();
    const newVector = {
      points,
      createdAt: now,
      type,
      color,
      strokeWidth,
      box: { x, y, height, width },
    };

    setVectors({
      ...vectors,
      [now]: newVector
    });
  };

  const saveTextVector = ({ x, y, content, fontSize = 16, color = 'black' }) => {
    const now = Date.now();
    const newVector = {
      createdAt: now,
      type: 'text',
      x,
      y,
      content,
      fontSize,
      color,
    };

    setVectors({
      ...vectors,
      [now]: newVector
    });
  };

  const updateVectorPosition = ({ deltaX, deltaY, idsToChange }) => {
    const updatedVectors = {};

    idsToChange.forEach(id => {
      const vector = vectors[id];
      
      // vectors with points
      if (vector.type.match(/polyline|path/)) {
        const newPoints = vector.points.map((p) => {
          return {
            ...p,
            x: p.x + deltaX,
            y: p.y + deltaY
          };
        });
  
        updatedVectors[id] = {
          ...vector,
          points: newPoints,
          box: {
            ...vector.box,
            x: vector.box.x + deltaX,
            y: vector.box.y + deltaY,
          }
        };
      }

      // text vectors
      if (vector.type.match(/text/)) {
        newVector[id] = {
          ...vector,
          x: vector.x + deltaX,
          y: vector.y + deltaY,
        }
      }
    });

    setVectors({
      ...vectors,
      ...updatedVectors,
    });
  };

  const updateVectorResize = ({ scaleX, scaleY, selectionBox, corners, resizeStyle, selectedVectors }) => {
    const {x, y, width, height } = selectionBox;
    const updatedVectors = {};

    selectedVectors.forEach(id => {
      const vector = vectors[id];
      const newVector = { ...vector };
      let newPoints = [];

      if (vector.type.match(/polyline|path/)) {
        const firstX = corners.right ? x : x + width;
        const firstY = corners.bottom ? y : y + height;
    
        newPoints = vector.points.map((p) => {
          const newX = scaleX * p.x + (1 - scaleX) * firstX; // (cx+(1-c)a,cy+(1-c)b),
          const newY = scaleY * p.y + (1 - scaleY) * firstY;
    
          return {
            ...p,
            x: newX,
            y: newY
          };
        });

        newVector.points = newPoints;
        newVector.box = {
          x: scaleX * vector.box.x + (1 - scaleX) * firstX,
          y: scaleY * vector.box.y + (1 - scaleY) * firstY,
          width: vector.box.width * scaleX,
          height: vector.box.height * scaleY,
        };
      }

      if (vector.type === 'text') {
        newVector.x = scaleX * vector.x + (1 - scaleX) * vector.x;
        newVector.y = scaleY * vector.y + (1 - scaleY) * vector.y;
        newVector.resizeStyle = resizeStyle;
      }

      updatedVectors[id] = newVector;
    });

    setVectors({
      ...vectors,
      ...updatedVectors
    });
  };

  const removeVector = (id) => {
    setVectors((vectors) => {
      delete vectors[id];
      return { ...vectors };
    });
  };

  const updateVectorsById = (ids, updates) => {
    setVectors(vectors => {
      ids.forEach(id => {
        vectors[id] = { ...vectors[id], ...updates }
      });
      return { ...vectors };
    });
  };

  return (
    <BoardContext.Provider
      value={{
        points,
        vectors,
        addPoint,
        replaceLastPoint,
        clearPoints,
        savePointsVector,
        clearPointByIndex,
        clearLastPoint,
        updateVectorPosition,
        removeVector,
        updateVectorResize,
        tempText,
        setTempText,
        saveTextVector,
        updateVectorsById,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

const useBoard = () => {
  const context = useContext(BoardContext);

  if (context === undefined) {
    throw new Error("useBoard must be used within a BoardProvider");
  }
  return context;
};

export default useBoard;
