import "./styles.css";

import { ToolsProvider } from "./ToolsContext";
import ToolBar from "./ToolBar";
import Pad from "./Pad";
import { BoardProvider } from "./BoardContext";
import ColorPicker from "./ColorPicker";
import StrokeWidthPicker from "./StrokeWidthPicker";
import { SelectionProvider } from "./SelectionContext";
import { DragProvider } from "./DragContext";

export default function App() {
  return (
    <ToolsProvider>
      <BoardProvider>
        <SelectionProvider>
          <DragProvider>
            <div className="App">
              <Pad />
              <ToolBar />
              <ColorPicker />
              <StrokeWidthPicker />
            </div>
          </DragProvider>
        </SelectionProvider>
      </BoardProvider>
    </ToolsProvider>
  );
}
