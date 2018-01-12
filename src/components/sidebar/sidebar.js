import React from 'react';
import _ from 'lodash';
import './sidebar.css';
import SidebarItem from '../sidebarItem/sidebarItem.js';

export default class Sidebar extends React.Component {
  componentDidMount() {
    const {getLists} = this.props;
    getLists()
  }

  componentWillReceiveProps(nextProps) {
    const {setActiveList, activeList} = this.props;

    // Set default active list if none is selected
    if (nextProps.listOrder.length && activeList === null) {
      setActiveList(nextProps.listOrder[0])
    }
  }

  setBadgeCountTitle() {
    const {todayBadgeCount} = this.props;
    if (todayBadgeCount) {
      document.title = `dundun (${todayBadgeCount})`
    }
  }

  render() {
    // new list options = things to do / things to remember
    const {lists, todayBadgeCount, setActiveList, activeList, onDone, logout} = this.props;

    let coreLists = _.filter(lists, { 'type': 'core'});
    let customLists = _.filter(lists, { 'type': 'custom'});

    this.setBadgeCountTitle()

    return (
      <div className="sidebar">
        <img className="sidebar-logo" src="/favicon.png" alt="dundun logo" />
        <div className="sidebar-group">
          <div className="sidebar-item-label">Tasks</div>
          {coreLists.map(list => (
            <SidebarItem key={list.id} list={list} todayBadgeCount={todayBadgeCount} setActiveList={setActiveList} activeList={activeList} onDone={onDone} />
          ))}
        </div>

        <div className="sidebar-group">
          <div className="sidebar-item-label">Lists</div>
          {customLists.map(list => (
            <SidebarItem key={list.id} list={list} setActiveList={setActiveList} activeList={activeList} onDone={onDone} />
          ))}
        </div>

        <div className="sidebar-group sidebar-group--settings">
          <div className="sidebar-item" onClick={logout}>Logout &rarr;</div>
        </div>
      </div>
    );
  }
}
