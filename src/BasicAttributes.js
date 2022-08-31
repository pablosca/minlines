import useBoard from './BoardContext';
import useTools from './ToolsContext';
import Dimensions from './Dimensions';
import PropTypes from 'prop-types';

export default function BasicAttributes ({ vectors: vectorsIds }) {
  const { tool, strokeColor, strokeWidth, setStrokeColor, setStrokeWidth } = useTools();
  const { vectors: allVectors, updateVectorsById } = useBoard();
  // const notSelectTool = tool && tool !== 'select';
  const isNascentVector = !vectorsIds.length;
  const vectors = vectorsIds.map(id => allVectors[id]);
  const single = vectors.length === 1;
  const multiple = vectors.length > 1;

  // TODO: Refactor these and make them more legible
  const renderedStrokeWidth = isNascentVector ? strokeWidth : (multiple ? 3 : vectors[0].strokeWidth);
  const renderedStrokeColor = isNascentVector ? strokeColor : (multiple ? '#000000' : vectors[0].strokeColor);
  const renderedStrokeOpacity = (isNascentVector ? 1 : (multiple ? 1 : vectors[0].strokeOpacity)) * 100;
  const renderedStrokeLinecap = isNascentVector ? 'square' : (multiple ? 'square' : vectors[0].strokeLinecap);
  const renderedFillColor = multiple ? '#000000' : single ? vectors[0].fillColor || '#000000' : '#000000';
  const renderedFillOpacity = (isNascentVector ? 1 : (multiple ? 1 : vectors[0].fillOpacity || 1)) * 100;
  const hasPointsVectors = vectors.find(v => v.type.match(/path|polyline/));

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
    updateVectorsById(vectorsIds, { strokeOpacity: parseInt(e.currentTarget.value) / 100 });
  };

  const onFillColorChange = (e) => {
    updateVectorsById(vectorsIds, { fillColor: e.currentTarget.value });
  };

  const onFillOpacityChange = (e) => {
    updateVectorsById(vectorsIds, { fillOpacity: parseInt(e.currentTarget.value) / 100 });
  };

  const onStrokeLinecapChange = (value) => {
    return _ => {
      updateVectorsById(vectorsIds, { strokeLinecap: value });
    };
  };

  return (
    <>
      {single && <Dimensions vectorsIds={vectorsIds} />}
      <section className="attribute-section">
        <h4 className="attribute-section-title">Stroke</h4>
        <div className="attribute">
          <label className="group">
            <svg className="icon">
              <use xlinkHref="#icon-stroke-width" />
            </svg>

            <input
              className="mini-field short-field"
              type="number"
              id="strokeWidth"
              name="strokeWidth"
              defaultValue={renderedStrokeWidth}
              onChange={onStrokeWidthChange}
            />
            <span>{multiple && 'multiple'}</span>
          </label>

          {hasPointsVectors && (
            <div className="group ml-auto">
              <button
                onClick={onStrokeLinecapChange('square')}
                className={`button light small ${renderedStrokeLinecap === 'square' && 'selected'}`}
              >
                <svg className="icon">
                  <use xlinkHref="#icon-stroke-cap-square" />
                </svg>
              </button>

              <button
                onClick={onStrokeLinecapChange('round')}
                className={`button light small ${renderedStrokeLinecap === 'round' && 'selected'}`}
              >
                <svg className="icon">
                  <use xlinkHref="#icon-stroke-cap-round" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className="attribute">
          <input
            type="color"
            id="strokeColor"
            name="strokeColor"
            defaultValue={renderedStrokeColor}
            onChange={onStrokeColorChange}
          />

          <span>{multiple ? 'multiple' : renderedStrokeColor}</span>

          <label className="mini-field short-field ml-auto">
            <input
              type="number"
              id="strokeOpacity"
              name="strokeOpacity"
              defaultValue={renderedStrokeOpacity}
              onChange={onStrokeOpacityChange}
            />
            <span className="value">%</span>
          </label>
        </div>
      </section>

      {!hasPointsVectors && <section className="attribute-section">
        <h4 className="attribute-section-title">Fill</h4>

        <div className="attribute">
          <input
            type="color"
            id="fillColor"
            name="fillColor"
            defaultValue={renderedFillColor}
            onChange={onFillColorChange}
          />

          <span>{multiple ? 'multiple' : renderedFillColor}</span>

          <label className="mini-field ml-auto">
            <input
              type="number"
              id="fillOpacity"
              name="fillOpacity"
              min="0.05"
              max="1"
              step="0.01"
              className="range"
              defaultValue={renderedFillOpacity}
              onChange={onFillOpacityChange}
            />
            <span className="value">%</span>
          </label>
        </div>
      </section>}
    </>
  );
}

BasicAttributes.propTypes = {
  vectors: PropTypes.array
};
