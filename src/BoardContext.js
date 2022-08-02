import { useState, createContext, useContext } from "react";

/*type Vector = {
  points?: Array,
  createdAt: number,
  type: string
};*/

const initialState = {
  points: [],
  vectors: {}
};

const BoardContext = createContext(initialState);

export const BoardProvider = ({ children }) => {
  const [points, setPoints] = useState([]);
  const [vectors, setVectors] = useState({});

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

  const savePointsVector = (type, color) => {
    const now = Date.now();
    const newVector = {
      points,
      createdAt: now,
      type,
      color
    };

    setVectors({
      ...vectors,
      [now]: newVector
    });
  };

  const updatePointsVectorDelta = (id, { deltaX, deltaY }) => {
    const vector = vectors[id];

    const newPoints = vector.points.map((p) => {
      return {
        ...p,
        x: p.x + deltaX,
        y: p.y + deltaY
      };
    });

    setVectors({
      ...vectors,
      [id]: {
        ...vector,
        points: newPoints
      }
    });
  };

  const updatePointsVectorResize = (
    id,
    { scaleX, scaleY }
  ) => {
    const vector = vectors[id];
    const first = vector.points[0];

    const newPoints = vector.points.map((p) => {
      const newX = scaleX * p.x + (1 - scaleX) * first.x; // (cx+(1-c)a,cy+(1-c)b),
      const newY = scaleY * p.y + (1 - scaleY) * first.y;

      return {
        ...p,
        x: newX,
        y: newY
      };
    });

    setVectors({
      ...vectors,
      [id]: {
        ...vector,
        points: newPoints
      }
    });
  };

  const removeVector = (id) => {
    setVectors((vectors) => {
      delete vectors[id];
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
        updatePointsVectorDelta,
        removeVector,
        updatePointsVectorResize
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
