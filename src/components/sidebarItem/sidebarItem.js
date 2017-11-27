import React from 'react';
import classNames from 'classnames';
import './sidebarItem.css';

export default class SidebarItem extends React.Component {
  renderBadgeCount(list) {
    const {todayBadgeCount} = this.props;

    if (list.type === 'today') {
      return (
        <div className="sidebar-item__badge-count">{todayBadgeCount}</div>
      )
    } else {
      return null;
    }
  }

  render() {
    const {list, setActiveList, activeList} = this.props;

    let navItemClasses = classNames(
      'sidebar-item',
      {'sidebar-item--active': list.id === activeList}
    );

    return (
      <div className={navItemClasses} onClick={() => { setActiveList(list.id); }}>{list.title}{this.renderBadgeCount(list)}</div>
    )
  }
}
