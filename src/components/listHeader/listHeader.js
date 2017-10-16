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

  render() {
    const {toggleVisible, title, viewId} = this.props;

    let todoListHeaderClasses = classNames(
      'list-header',
      'list-header--' + viewId
    );

    return (
      <div className={todoListHeaderClasses}>
        <div onClick={() => { toggleVisible({viewId}); }} dangerouslySetInnerHTML={{ __html: title }}></div>
        {this.renderToggle()}
      </div>
    )
  }
}
