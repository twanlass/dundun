import React from 'react';
import './nav.css';

export default class Nav extends React.Component {

  onNewList() {
    alert('coming soon ;-)')
  }

  render() {
    // new list options = things to do / things to remember
    return (
      <div className="nav">
        <div className="nav-item nav-item--active">Tasks</div>
        <div className="nav-item" onClick={() => { this.onNewList(); }}>+ New List</div>
      </div>
    );
  }
}
