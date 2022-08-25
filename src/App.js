import './styles.scss';

import { ToolsProvider } from './ToolsContext';
import ToolBar from './ToolBar';
import Pad from './Pad';
import { BoardProvider } from './BoardContext';
import { SelectionProvider } from './SelectionContext';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas);

export default function App () {
  return (
    <ToolsProvider>
      <BoardProvider>
        <SelectionProvider>
            <div className="App">
              <Pad />

              <nav className="navbar">
                <ToolBar />
              </nav>
            </div>
        </SelectionProvider>
      </BoardProvider>
    </ToolsProvider>
  );
}
