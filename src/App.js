import "./styles.css";

import { ToolsProvider } from "./ToolsContext";
import ToolBar from "./ToolBar";
import Pad from "./Pad";
import { BoardProvider } from "./BoardContext";
import ColorPicker from "./ColorPicker";

export default function App() {
  return (
    <ToolsProvider>
      <BoardProvider>
        <div className="App">
          <Pad />
          <ToolBar />
          <ColorPicker />
        </div>
      </BoardProvider>
    </ToolsProvider>
  );
}
