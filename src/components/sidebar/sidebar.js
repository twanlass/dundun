import React from 'react';
import browserHistory from '../../helpers/history.js';
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

  gotoLogin() {
    const pathname = '/login';
    const search = '';
    const location = {pathname, search};

    // Update the browser URL and notify any listeners added
    // via browserHistory.listen()
    browserHistory.push(location);
  }

  render() {
    // new list options = things to do / things to remember
    const {lists, todayBadgeCount, setActiveList, activeList} = this.props;

    let coreLists = _.filter(lists, { 'type': 'core'});
    let customLists = _.filter(lists, { 'type': 'custom'});

    return (
      <div className="sidebar">
        <div className="sidebar-group">
          <div className="sidebar-item-label">Tasks</div>
          {coreLists.map(list => (
            <SidebarItem key={list.id} list={list} todayBadgeCount={todayBadgeCount} setActiveList={setActiveList} activeList={activeList} />
          ))}
        </div>

        <div className="sidebar-group">
          <div className="sidebar-item-label">Lists</div>
          {customLists.map(list => (
            <SidebarItem key={list.id} list={list} setActiveList={setActiveList} activeList={activeList} />
          ))}
        </div>

        <div className="sidebar-group">
          <div className="sidebar-item-label">Settings</div>
          <div className="sidebar-item" onClick={() => { this.gotoLogin(); }}>Login</div>
        </div>
      </div>
    );
  }
}
