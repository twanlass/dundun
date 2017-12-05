import React from 'react';
import List from '../../containers/listContainer/listContainer.js';
import Sidebar from '../../containers/sidebarContainer/sidebarContainer.js';
import '../../css/app.css';
import '../../css/todo-icon-font.css';

const AppContainer = () => (
  <div className="flex-container">
    <Sidebar />
    <List />
  </div>
);

export default AppContainer;
