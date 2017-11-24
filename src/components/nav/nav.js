import React from 'react';
import NavItem from '../navItem/navItem.js';
import './nav.css';

export default class Nav extends React.Component {
  componentDidMount() {
    this.props.getLists()
  }

  componentWillReceiveProps(nextProps) {
    const {setActiveList, activeList} = this.props;

    // Set default active list if none is selected
    if (nextProps.lists.length && activeList === null) {
      setActiveList(nextProps.lists[0].id)
    }
  }

  onNewList() {
    alert('coming soon ;-)')
  }

  render() {
    // new list options = things to do / things to remember
    const {setActiveList, activeList} = this.props;

    return (
      <div className="nav">
        {this.props.lists.map(list => (
          <NavItem key={list.id} list={list} setActiveList={setActiveList} activeList={activeList} />
        ))}
        <div className="nav-item" onClick={() => { this.onNewList(); }}>+ New List</div>
      </div>
    );
  }
}
