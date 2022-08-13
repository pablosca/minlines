import useBoard from "./BoardContext";
import useTools from "./ToolsContext";

export default function BasicAttributes({ vectors: vectorsIds }) {
  const { tool, strokeColor, strokeWidth, setStrokeColor, setStrokeWidth } = useTools();
  const { vectors: allVectors, updateVectorsById } = useBoard();
  // const notSelectTool = tool && tool !== 'select';
  const isNascentVector = !vectorsIds.length;
  const vectors = vectorsIds.map(id => allVectors[id]);
  const multiple = vectors.length > 1;
  const renderedStrokeWidth = isNascentVector ? strokeWidth : (multiple ? 3 : vectors[0].strokeWidth);
  const renderedStrokeColor = isNascentVector ? strokeColor :  (multiple ? '#000000' : vectors[0].strokeColor);

  const onStrokeWidthChange = (e) => {
    const newValue = parseInt(e.currentTarget.value);
    if (isNascentVector) {
      setStrokeWidth(newValue);
      return;
    }

    updateVectorsById(vectorsIds, { strokeWidth: newValue });
  };

  const onStrokeColorChange = (e) => {
    const newValue = e.currentTarget.value;
    if (isNascentVector) {
      setStrokeColor(newValue);
      return;
    }

    updateVectorsById(vectorsIds, { strokeColor: newValue });
  };

  const onStrokeOpacityChange = (e) => {
    updateVectorsById(vectorsIds, { strokeOpacity: parseFloat(e.currentTarget.value) });
  };

  const onFillColorChange = (e) => {
    updateVectorsById(vectorsIds, { fillColor: e.currentTarget.value });
  };

  const onFillOpacityChange = (e) => {
    updateVectorsById(vectorsIds, { fillOpacity: parseFloat(e.currentTarget.value) });
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
            defaultValue={renderedStrokeWidth}
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
            defaultValue={renderedStrokeColor}
            onChange={onStrokeColorChange}
          />

          <small>{multiple && '(multiple)'}</small>
        </div>

        {!!vectors.length && <div className="attribute">
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
        </div>}
      </section>

      {!!vectors.length && <section className="attribute-section">
        <h4 className="attribute-section-title">Fill</h4>

        <div className="attribute">
          <label htmlFor="fillColor">Color</label>
          <input
            type="color"
            id="fillColor"
            name="fillColor"
            defaultValue={multiple ? '#000' : vectors[0].fillColor}
            onChange={onFillColorChange}
          />

          <small>{multiple && '(multiple)'}</small>
        </div>

        <div className="attribute">
          <label htmlFor="fillOpacity">Opacity</label>
          <input
            type="range"
            id="fillOpacity"
            name="fillOpacity"
            min="0.05"
            max="1"
            step="0.01"
            className="range"
            defaultValue={multiple ? 1 : (vectors[0].fillOpacity || 1)}
            onChange={onFillOpacityChange}
          />
          <small>{multiple && '(multiple)'}</small>
        </div>
      </section>}
    </>
  );
}