import React from 'react';
import classNames from 'classnames';

export default class NavItem extends React.Component {
  render() {
    const {list, setActiveList, activeList} = this.props;

    let navItemClasses = classNames(
      'nav-item',
      {'nav-item--active': list.id === activeList}
    );

    return (
      <div className={navItemClasses} onClick={() => { setActiveList(list.id); }}>{list.title}</div>
    )
  }
}
