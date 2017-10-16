import React from 'react';
import classNames from 'classnames';
import './listHeader.css';

export default class ListHeader extends React.Component {
  renderToggle() {
    const {visible, showDone, toggleShowDone} = this.props;

    if (visible) {
      return (
        <input type="checkbox" defaultChecked={showDone} onClick={() => { toggleShowDone(); }} />
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
