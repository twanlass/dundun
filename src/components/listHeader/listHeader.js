import React from 'react';
import classNames from 'classnames';
import './listHeader.css';
import '../../css/todo-icon-font.css';

export default class ListHeader extends React.Component {
  renderToggle() {
    let {showDone, toggleShowDone, showToggle = true} = this.props;

    let toggleClasses = classNames(
      'ico-filter',
      {'ico-filter--active': !showDone}
    );

    if (showToggle) {
      return (
        <i className={toggleClasses} onClick={() => { toggleShowDone(); }}></i>
      )
    }
  }

  renderDate() {
    const {date} = this.props;

    if (date) {
      return (
        <div className="list-header__date">{date}</div>
      )
    }
  }

  renderTitle() {
    const {title} = this.props;

    if (title) {
      return (
        <div className="list-header__title">{title}</div>
      )
    }
  }

  render() {
    let todoListHeaderClasses = classNames(
      'list-header'
    );

    return (
      <div className={todoListHeaderClasses}>
        <div className="list-header__group">
          {this.renderDate()}
          {this.renderTitle()}
        </div>
        {this.renderToggle()}
      </div>
    )
  }
}
