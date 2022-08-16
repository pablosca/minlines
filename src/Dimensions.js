import { useCallback, useEffect } from "react";
import useBoard from "./BoardContext";
import useSelection from "./SelectionContext";

export default function Dimensions({ vectorsIds }) {
  const { vectors: allVectors, updateVectorsById } = useBoard();
  const { updateSelectionBox } = useSelection();
  const vectors = vectorsIds.map(id => allVectors[id]);

  const xValue = Math.round(vectors[0].box.x * 100) / 100;
  const yValue = Math.round(vectors[0].box.y * 100) / 100;
  const widthValue = Math.round(vectors[0].box.width * 100) / 100;
  const heightValue = Math.round(vectors[0].box.height * 100) / 100;

  const onDimensionChange = data => {
    updateVectorsById(vectorsIds, data);
  };

  useEffect(() => {
    updateSelectionBox(vectors[0].box);
  }, [updateSelectionBox, vectors]);

  return (
    <section className="attribute-section">
      <h4 className="attribute-section-title">Dimensions</h4>
      <div className="attribute row">
        <label className="mini-field">
          <input
            type="number"
            defaultValue={xValue}
            onBlur={e => onDimensionChange({ deltaX: parseFloat(e.currentTarget.value) - xValue })}
            onKeyPress={e => e.key === 'Enter' && e.currentTarget.blur()}
          />
          <span>x</span>
        </label>

        <label className="mini-field">
          <input
            type="number"
            defaultValue={yValue}
            onBlur={e => onDimensionChange({ deltaY: parseFloat(e.currentTarget.value) - yValue })}
            onKeyPress={e => e.key === 'Enter' && e.currentTarget.blur()}
          />
          <span>y</span>
        </label>
      </div>

      {/* <div className="attribute row">
        <label className="mini-field">
          <input
            type="number"
            defaultValue={widthValue}
            onBlur={e => onDimensionChange({ width: e.currentTarget.value })}
          />
          <span>w</span>
        </label>

        <label className="mini-field">
          <input
            type="number"
            defaultValue={heightValue}
            onBlur={e => onDimensionChange({ height: e.currentTarget.value })}
          />
          <span>h</span>
        </label>
      </div> */}
    </section>
  );
}