import "./styles.css";

import { ToolsProvider } from "./ToolsContext";
import ToolBar from "./ToolBar";
import Pad from "./Pad";
import { BoardProvider } from "./BoardContext";
import ColorPicker from "./ColorPicker";
import { SelectionProvider } from "./SelectionContext";

export default function App() {
  return (
    <ToolsProvider>
      <BoardProvider>
        <SelectionProvider>
          <div className="App">
            <Pad />
            <ToolBar />
            <ColorPicker />
          </div>
        </SelectionProvider>
      </BoardProvider>
    </ToolsProvider>
  );
}
