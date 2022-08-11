import { useState } from "react";
import useTools from "./ToolsContext";

export default function Sidebar() {
  const [isClosed, setIsClosed] = useState(false);
  const { withGrid, setWithGrid } = useTools();

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
      {!isClosed && <aside className="sidebar">
        <label>
          <input type="checkbox" onChange={onGridChange} checked={withGrid} />
          {withGrid ? 'Hide' : 'Show'} grid
        </label>
      </aside>}
    </>
  )
}