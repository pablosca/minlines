import useTools from "./ToolsContext";

export default function Sidebar() {
  const { withGrid, setWithGrid } = useTools();

  const onGridChange = (e) => {
    e.stopPropagation();
    setWithGrid(e.target.checked);
  };

  return (
    <aside className="sidebar">
      <label>
        <input type="checkbox" onChange={onGridChange} checked={withGrid} />
        {withGrid ? 'Hide' : 'Show'} grid
      </label>
    </aside>
  )
}