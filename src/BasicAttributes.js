import { useState } from "react";
import useBoard from "./BoardContext";

export default function BasicAttributes({ vectors: vectorsIds }) {
  const { vectors: allVectors, updateVectorsById } = useBoard();

  const vectors = vectorsIds.map(id => allVectors[id]);
  const multiple = vectors.length > 1;

  const onStrokeWidthChange = (e) => {
    updateVectorsById(vectorsIds, { strokeWidth: parseInt(e.currentTarget.value) });
  };

  const onStrokeColorChange = (e) => {
    updateVectorsById(vectorsIds, { strokeColor: e.currentTarget.value });
  };

  const onStrokeOpacityChange = (e) => {
    updateVectorsById(vectorsIds, { strokeOpacity: parseFloat(e.currentTarget.value) });
  };
  
  return (
    <>
      <section className="attribute-section">
        <h4 className="attribute-section-title">Stroke</h4>
        <div className="attribute">
          <label htmlFor="strokeWidth">Width</label>
          <input
            type="range"
            id="strokeWidth"
            name="strokeWidth"
            min="1"
            max="20"
            className="range"
            defaultValue={multiple ? 3 : vectors[0].strokeWidth}
            onChange={onStrokeWidthChange}
          />
          <small>{multiple && '(multiple)'}</small>
        </div>

        <div className="attribute">
          <label htmlFor="strokeColor">Color</label>
          <input
            type="color"
            id="strokeColor"
            name="strokeColor"
            defaultValue={multiple ? '#000' : vectors[0].strokeColor}
            onChange={onStrokeColorChange}
          />

          <small>{multiple && '(multiple)'}</small>
        </div>

        <div className="attribute">
          <label htmlFor="strokeOpacity">Opacity</label>
          <input
            type="range"
            id="strokeOpacity"
            name="strokeOpacity"
            min="0.05"
            max="1"
            step="0.01"
            className="range"
            defaultValue={multiple ? 1 : (vectors[0].strokeOpacity || 1)}
            onChange={onStrokeOpacityChange}
          />
          <small>{multiple && '(multiple)'}</small>
        </div>
      </section>
    </>
  );
}