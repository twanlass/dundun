import React from 'react';
import classNames from 'classnames';
import './sidebarItem.css';

export default class SidebarItem extends React.Component {
  renderBadgeCount(list) {
    const {todayBadgeCount} = this.props;

    if (list.title === 'today' && todayBadgeCount) {
      return (
        <div className="sidebar-item__badge-count">{todayBadgeCount}</div>
      )
    } else {
      return null;
    }
  }

  renderHashtag(list) {
    if (list.type === 'custom') {
      return '#'
    }
  }

  render() {
    const {list, setActiveList, activeList, onDone} = this.props;

    let navItemClasses = classNames(
      'sidebar-item',
      {'sidebar-item--active': list.id === activeList}
    );

    return (
      <div
        className={navItemClasses}
        onClick={() => {
          setActiveList(list.id);
          onDone(null);
        }}
      >
        {this.renderHashtag(list)}{list.title}{this.renderBadgeCount(list)}
      </div>
    )
  }
}
