import React from 'react';
import _ from 'lodash';
import SidebarItem from '../sidebarItem/sidebarItem.js';
import './sidebar.css';

export default class Sidebar extends React.Component {
  componentDidMount() {
    const {getLists} = this.props;
    getLists()
  }

  componentWillReceiveProps(nextProps) {
    const {setActiveList, activeList} = this.props;

    // Set default active list if none is selected
    if (nextProps.lists.length && activeList === null) {
      setActiveList(nextProps.lists[0].id)
    }
  }

  render() {
    // new list options = things to do / things to remember
    const {lists, todayBadgeCount, setActiveList, activeList} = this.props;

    let coreLists = _.filter(lists, function(list) { return list.type !== 'custom'; });
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
      </div>
    );
  }
}
