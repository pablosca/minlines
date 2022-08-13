import { useState } from "react";
import BasicAttributes from "./BasicAttributes";
import useSelection from "./SelectionContext";
import useBoard from "./BoardContext";

export default function Sidebar() {
  const [isClosed, setIsClosed] = useState(false);
  const { withGrid, setWithGrid } = useBoard();
  const { selectedVectors, isSelectingArea } = useSelection();

  const toggleSidebar = () => {
    setIsClosed(!isClosed)
  };

  const onGridChange = (e) => {
    e.stopPropagation();
    setWithGrid(e.target.checked);
  };

  return (
    <>
      <button className="button sidebar-close" onClick={toggleSidebar}>
        {isClosed ? 'Open sidebar' : 'Close'}
      </button>

      {!isClosed && (
        <aside className="sidebar">
          <section className="attribute-section">
            <label>
              <input type="checkbox" onChange={onGridChange} checked={withGrid} />
              {withGrid ? 'Hide' : 'Show'} grid
            </label>
          </section>
          {!isSelectingArea && <BasicAttributes vectors={selectedVectors} />}
        </aside>
      )}
    </>
  )
}