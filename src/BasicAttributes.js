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
  
  return (
    <section>
      <label htmlFor="strokeWidth">Stroke width {multiple && '(multiple stroke widths)'}</label>
      <input
        type="range"
        id="strokeWidth"
        name="strokeWidth"
        min="1"
        max="20"
        defaultValue={multiple ? 3 : vectors[0].strokeWidth}
        onChange={onStrokeWidthChange}
      />

      <label htmlFor="strokeColor">Stroke color {multiple && '(multiple stroke colors)'}</label>
      <input
        type="color"
        id="strokeColor"
        name="strokeColor"
        defaultValue={multiple ? '#000' : vectors[0].strokeColor}
        onChange={onStrokeColorChange}
      />
    </section>
  );
}