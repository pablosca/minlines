import useTools from "./ToolsContext";

export default function SelectionWrapper() {
  const { selectionBox } = useTools();

  return (
    <rect
      x={selectionBox.x - 10}
      y={selectionBox.y - 10}
      width={selectionBox.width + 20}
      height={selectionBox.height + 20}
      stroke="blue"
      strokeOpacity=".4"
      fill="none"
    ></rect>
  );
}
