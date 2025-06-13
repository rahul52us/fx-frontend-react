import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Sidebar from './component/Sidebar';
import FormBuilder from './component/FormBuilder';
import './side.css';

const App: React.FC = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="sideApp">
        <Sidebar />
        <FormBuilder />
      </div>
    </DndProvider>
  );
}

export default App;
