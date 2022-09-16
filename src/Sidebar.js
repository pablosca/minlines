import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useState } from 'react';
import BasicAttributes from './BasicAttributes';
import useSelection from './SelectionContext';
import useBoard from './BoardContext';

export default function Sidebar () {
  const [isClosed, setIsClosed] = useState(false);
  const { withGrid, setWithGrid } = useBoard();
  const { selectedVectors, isSelectingArea } = useSelection();

  const toggleSidebar = () => {
    setIsClosed(!isClosed);
  };

  const onGridChange = (e) => {
    e.stopPropagation();
    setWithGrid(e.target.checked);
  };

  return (
    <>
      <button className={`button sidebar-close ${isClosed ? 'inverse is-closed' : 'light'}`} onClick={toggleSidebar}>
        {<FontAwesomeIcon icon={isClosed ? 'chevron-left' : 'chevron-right'} size="lg" />}
      </button>

      {!isClosed && (
        <aside className="sidebar">
          <section className="attribute-section">
            <label className="grid-toggle">
              <input type="checkbox" onChange={onGridChange} checked={withGrid} />
              <svg className="icon">
                <use xlinkHref="#icon-grid" />
              </svg>
            </label>
          </section>
          {!isSelectingArea && !!selectedVectors.length && <BasicAttributes vectors={selectedVectors} />}
        </aside>
      )}
    </>
  );
}
