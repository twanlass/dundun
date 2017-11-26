import React from 'react';
import classNames from 'classnames';
import './listSectionHeader.css';
import '../../css/todo-icon-font.css';

export default class ListSectionHeader extends React.Component {
  renderToggle() {
    let {collapsed, showDone, toggleShowDone} = this.props;

    let toggleClasses = classNames(
      'ico-filter',
      {'ico-filter--active': !showDone}
    );

    if (!collapsed) {
      return (
        <i className={toggleClasses} onClick={() => { toggleShowDone(); }}></i>
      )
    } else {
      return null;
    }
  }

  renderBadgeCount() {
    let {badgeCount} = this.props;

    if (badgeCount) {
      return(
        <div className="list-header__title-badge">{badgeCount}</div>
      )
    } else {
      return null;
    }
  }

  render() {
    let {collapsed, title, viewId} = this.props;

    let todoListHeaderClasses = classNames(
      'list-header',
      'list-header--' + viewId,
      {'list-header--active': collapsed === false}
    );

    return (
      <div className={todoListHeaderClasses}>
        <div className="list-header__title">
          {title}{this.renderBadgeCount()}
        </div>
        {this.renderToggle()}
      </div>
    )
  }
}
