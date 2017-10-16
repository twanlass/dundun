import React from 'react';
import './nav.css';

export default class Nav extends React.Component {

  onNewList() {
    alert('coming soon ;-)')
  }

  render() {
    return (
      <div className="nav">
        <div className="nav-item nav-item--active">Todos</div>
        <div className="nav-item" onClick={() => { this.onNewList(); }}>+ New List</div>
      </div>
    );
  }
}
