import React from 'react';
import './css/app.css';
import './css/todo-icon-font.css';
import List from './containers/listContainer/listContainer.js';
import Nav from './containers/sidebarContainer/sidebarContainer.js';

const App = () => (
  <div className="todos-app">
    <Nav />
    <List />
  </div>
)

export default App;
