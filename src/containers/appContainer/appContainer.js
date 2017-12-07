import React from 'react';
import List from '../../containers/listContainer/listContainer.js';
import Sidebar from '../../containers/sidebarContainer/sidebarContainer.js';

const AppContainer = () => (
  <div className="flex-container">
    <Sidebar />
    <List />
  </div>
);

export default AppContainer;
