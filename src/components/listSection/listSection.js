// @todo
// - Support for types of sections – today, done, etc
// - Allow a form to be optionally included

import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { CSSTransitionGroup } from 'react-transition-group';
import './listSection.css';
import ListSectionHeader from '../listSectionHeader/listSectionHeader.js'
import ListItem from '../listItem/listItem.js';
import ListItemForm from '../listItemForm/listItemForm.js';
import {isComplete, isNotComplete} from '../../helpers/helpers.js';

export default class listSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: this.props.collapsed,
      showDone: true
    };
  }

  toggleShowDone(){
    let showDone = !this.state.showDone;
    this.setState({ showDone: showDone });
  }

  toggleCollapsed() {
    let collapsed = !this.state.collapsed;
    this.setState({ collapsed: collapsed });
  }

  renderListSectionHeader() {
    const {items, title}  = this.props;
    let badgeCount = items.filter(isNotComplete).length;

    return (
      <ListSectionHeader
        collapsed={this.state.collapsed}
        toggleCollapsed={this.toggleCollapsed.bind(this)}
        showDone={this.state.showDone}
        toggleShowDone={this.toggleShowDone.bind(this)}
        title={title}
        badgeCount={badgeCount}
      />
    )
  }

  render() {
    const {items, nowEditing, nowDragging, add, remove, done, move, edit, onEdit, dragStart, dragEnd, dragOver}  = this.props;
    let completedItems = items.filter(isComplete);
    let notCompletedItems = items.filter(isNotComplete);
    let lastItemId = notCompletedItems.length ? notCompletedItems[notCompletedItems.length - 1].id : null;
    let allItems = [];

    if(this.state.showDone) {
      allItems = _.union(notCompletedItems, completedItems);
    } else {
      allItems = notCompletedItems;
    }

    let itemsClasses = classNames(
      'todos',
      {'todos--drag-active': nowDragging}
    );

    let itemSectionClasses = classNames(
      'todo-list',
      {'todo-list--active': !this.state.collapsed}
    )

    if (!this.state.collapsed) {
      return (
        <div className={itemSectionClasses}>
          {this.renderListSectionHeader()}
          <CSSTransitionGroup
            transitionName="todo-"
            component="div"
            className={itemsClasses}
            data-id={this.props.title}
            onDragOver={dragOver}
            transitionEnterTimeout={250}
            transitionLeaveTimeout={150}>
              {allItems.map(todo => (
                <ListItem
                  todo={todo}
                  key={todo.id}
                  nowEditing={nowEditing}
                  remove={remove}
                  done={done}
                  move={move}
                  edit={edit}
                  onEdit={onEdit}
                  dragStart={dragStart}
                  dragEnd={dragEnd}
                />
              ))}
          </CSSTransitionGroup>
          <ListItemForm
            add={add}
            onEdit={onEdit}
            nowEditing={nowEditing}
            lastTodoId={lastItemId}
          />
        </div>
      )
    } else {
      return (
        this.renderListSectionHeader()
      )
    }
  }
}

listSection.defaultProps = {
  collapsed: true
};
