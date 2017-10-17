import React from 'react';
import classNames from 'classnames';
import './listHeader.css';
import '../../css/todo-icon-font.css';

export default class ListHeader extends React.Component {
  renderToggle() {
    let {visible, showDone, toggleShowDone} = this.props;

    let toggleClasses = classNames(
      'ico-filter',
      {'ico-filter--active': !showDone}
    );

    if (visible) {
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
    let {visible, toggleVisible, title, viewId} = this.props;

    let todoListHeaderClasses = classNames(
      'list-header',
      'list-header--' + viewId,
      {'list-header--active': visible === true}
    );

    return (
      <div className={todoListHeaderClasses}>
        <div className="list-header__title" onClick={() => { toggleVisible({viewId}); }}>
          {title}{this.renderBadgeCount()}
        </div>
        {this.renderToggle()}
      </div>
    )
  }
}
