import { useCallback, useEffect, useState } from 'react';
import { round } from './utils';
import useBoard from './BoardContext';
import useSelection from './SelectionContext';
import PropTypes from 'prop-types';

export default function Dimensions ({ vectorsIds }) {
  const { vectors: allVectors, updateVectorsById } = useBoard();
  const { updateSelectionBox } = useSelection();
  const vectors = vectorsIds.map(id => allVectors[id]);
  const hasRectVectors = vectors.find(v => v.type === 'rectangle');

  const [deltaX, setDeltaX] = useState(0);
  const [deltaY, setDeltaY] = useState(0);
  const [scaleX, setScaleX] = useState(0);
  const [scaleY, setScaleY] = useState(0);

  const [xValue, setXValue] = useState(round(vectors[0].box.x));
  const [yValue, setYValue] = useState(round(vectors[0].box.y));
  const [widthValue, setWidthValue] = useState(round(vectors[0].box.width));
  const [heightValue, setHeightValue] = useState(round(vectors[0].box.height));
  const [cornerRadius, setCornerRadius] = useState(round(vectors[0].cornerRadius));

  const onPositionBlur = (difference, property) => {
    return e => {
      updateVectorsById(vectorsIds, {
        [difference]: parseFloat(e.currentTarget.value) - vectors[0].box[property]
      });
    };
  };

  const onSizeBlur = (difference, property) => {
    return e => {
      updateVectorsById(vectorsIds, {
        [difference]: parseFloat(e.currentTarget.value) / vectors[0].box[property],
        selectionBox: vectors[0].box,
        resizeStyle: vectors[0].resizeStyle
      });
    };
  };

  const onCornerRadiusBlur = () => {
    updateVectorsById(vectorsIds, { cornerRadius });
  };

  const onXChange = e => {
    setXValue(parseFloat(e.currentTarget.value));
    setDeltaX(xValue / vectors[0].box.x);
  };

  const onYChange = e => {
    setYValue(parseFloat(e.currentTarget.value));
    setDeltaY(xValue / vectors[0].box.y);
  };

  const onWidthChange = e => {
    setWidthValue(parseFloat(e.currentTarget.value));
    setScaleX(xValue / vectors[0].box.width);
  };

  const onHeightChange = e => {
    setHeightValue(parseFloat(e.currentTarget.value));
    setScaleY(heightValue / vectors[0].box.height);
  };

  const onCornerRadiusChange = e => {
    setCornerRadius(parseFloat(e.currentTarget.value));
  };

  const blurOnEnter = useCallback(e => e.key === 'Enter' && e.currentTarget.blur());

  useEffect(() => {
    const box = vectors[0].box;

    // TODO: revisit this whole solution
    setXValue(round(box.x));
    setYValue(round(box.y));
    setWidthValue(round(box.width));
    setHeightValue(round(box.height));

    updateSelectionBox(vectors[0].box);
  }, Object.values(vectors[0].box));

  return (
    <section className="attribute-section">
      <h4 className="attribute-section-title">Dimensions</h4>
      <div className="attribute row">
        <label className="mini-field">
          <input
            type="number"
            value={xValue}
            onChange={onXChange}
            onBlur={onPositionBlur('deltaX', 'x')}
            onKeyPress={blurOnEnter}
          />
          <span>x</span>
        </label>

        <label className="mini-field">
          <input
            type="number"
            value={yValue}
            onChange={onYChange}
            onBlur={onPositionBlur('deltaY', 'y')}
            onKeyPress={blurOnEnter}
          />
          <span>y</span>
        </label>
      </div>

      <div className="attribute row">
        <label className="mini-field">
          <input
            type="number"
            value={widthValue}
            onChange={onWidthChange}
            onBlur={onSizeBlur('scaleX', 'width')}
            onKeyPress={blurOnEnter}
          />
          <span>w</span>
        </label>

        <label className="mini-field">
          <input
            type="number"
            value={heightValue}
            onChange={onHeightChange}
            onBlur={onSizeBlur('scaleY', 'height')}
            onKeyPress={blurOnEnter}
          />
          <span>h</span>
        </label>
      </div>

      {hasRectVectors && (
        <div className="attribute row">
          <label className="mini-field">
            <input
              type="number"
              value={cornerRadius}
              onChange={onCornerRadiusChange}
              onBlur={onCornerRadiusBlur}
              onKeyPress={blurOnEnter}
            />
            <span>deg</span>
          </label>
        </div>
      )}
    </section>
  );
}

Dimensions.propTypes = {
  vectorsIds: PropTypes.array,
};
