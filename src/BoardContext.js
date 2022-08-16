import { useState, createContext, useContext, useRef } from "react";
import { defaultFillColor } from "./ToolsContext";

/*type Vector = {
  points?: Array,
  createdAt: number,
  type: string
};*/

const initialState = {
  points: [],
  vectors: {},
  tempText: null,
  tempShape: null,
  withGrid: true,
};

const BoardContext = createContext(initialState);

export const BoardProvider = ({ children }) => {
  const [points, setPoints] = useState([]);
  const [vectors, setVectors] = useState({});
  const [tempText, setTempText] = useState(null);
  const [tempShape, setTempShape] = useState(null);
  const [withGrid, setWithGrid] = useState(initialState.withGrid);

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

  const savePointsVector = ({ type, strokeColor, strokeWidth }) => {
    // TODO: Use a useRef, instead of using the id
    const tempElement = document.getElementById('temp-element');
    const { x, y, height, width } = tempElement.getBoundingClientRect();
    const now = Date.now();
    const newVector = {
      points,
      createdAt: now,
      type,
      strokeColor,
      strokeWidth,
      strokeOpacity: 1,
      box: { x, y, height, width },
    };

    setVectors({
      ...vectors,
      [now]: newVector
    });
  };

  const saveTextVector = ({ x, y, content, fontSize = 16, strokeColor = 'black' }) => {
    const now = Date.now();
    const newVector = {
      createdAt: now,
      type: 'text',
      x,
      y,
      content,
      fontSize,
      strokeColor,
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

      // shape vectors
      if (vector.type.match(/text|rectangle/)) {
        updatedVectors[id] = {
          ...vector,
          box: {
            ...vector.box,
            x: vector.box.x + deltaX,
            y: vector.box.y + deltaY,
          }
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
      const firstY = corners.bottom ? y : y + height;
      const firstX = corners.right ? x : x + width;
      let newPoints = [];

      if (vector.type.match(/polyline|path/)) {
    
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

      if (vector.type.match(/text|rectangle/)) {
        newVector.box = {
          x: scaleX * vector.box.x + (1 - scaleX) * firstX,
          y: scaleY * vector.box.y + (1 - scaleY) * firstY,
          width: vector.box.width * scaleX,
          height: vector.box.height * scaleY,
        };
        newVector.resizeStyle = resizeStyle;
      }

      updatedVectors[id] = newVector;
    });

    setVectors({
      ...vectors,
      ...updatedVectors
    });
  };

  const addShape = ({ x, y }) => {
    setTempShape({ startingPoint: { x, y } });
  };

  const updateShape = ({ x, y }) => {
    const { startingPoint } = tempShape;
    const shape = {};

    if (x > startingPoint.x) {
      // going right
      shape.x = startingPoint.x;
      shape.width = x - startingPoint.x;
    } else {
      shape.x = x;
      shape.width = startingPoint.x - x;
    }

    // y axis
    if (y > startingPoint.y) {
      // going right
      shape.y = startingPoint.y;
      shape.height = y - startingPoint.y;
    } else {
      shape.y = y;
      shape.height = startingPoint.y - y;
    }

    setTempShape(tempShape => {
      return {
        ...tempShape,
        ...shape,
      }
    });
  };

  const saveShape = ({ type, strokeColor, strokeWidth, fillColor = defaultFillColor, fillOpacity = .5 }) => {
    const { x, y, height, width } = tempShape;
    const now = Date.now();
    const newVector = {
      createdAt: now,
      type,
      strokeColor,
      strokeWidth,
      strokeOpacity: 1,
      fillColor,
      fillOpacity,
      box: { x, y, height, width },
    };

    setTempShape(null);

    setVectors({
      ...vectors,
      [now]: newVector
    });
  };

  const removeVector = (id) => {
    setVectors((vectors) => {
      delete vectors[id];
      return { ...vectors };
    });
  };

  const updateVectorsById = async (ids, updates) => {
    if (updates.deltaX || updates.deltaY) {
      const deltaX = updates.deltaX || 0;
      const deltaY = updates.deltaY || 0;

      await updateVectorPosition({ deltaX, deltaY, idsToChange: ids });

      return;
    }

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
        tempShape,
        setTempShape,
        addShape,
        updateShape,
        saveShape,
        withGrid,
        setWithGrid,
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
