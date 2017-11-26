import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { CSSTransitionGroup } from 'react-transition-group';
import './listSection.css';
import ListSectionHeader from '../listSectionHeader/listSectionHeader.js'
import ListItem from '../listItem/listItem.js';
import ListItemForm from '../listItemForm/listItemForm.js';

export default class listSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showDone: true
    };
  }

  toggleShowDone() {
    let showDone = !this.state.showDone;
    this.setState({ showDone: showDone });
  }

  renderListSectionHeader() {
    const {items, title, activeList}  = this.props;
    let badgeCount = _.filter(items, { 'completed': false, 'list_id': activeList}).length;

    return (
      <ListSectionHeader
        showDone={this.state.showDone}
        toggleShowDone={this.toggleShowDone.bind(this)}
        title={title}
        badgeCount={badgeCount}
      />
    )
  }

  // If a temp client id (cid) exists, use that as the key to
  // avoid rendering an item twice (temp item, and real API returned item)
  itemKey(item) {
    return item.cid ? item.cid : item.id;
  }

  render() {
    const {items, sorts, nowEditing, nowDragging, add, remove, done, reorder, edit, onEdit, dragStart, dragEnd, dragOver, activeList}  = this.props;

    let completedItems = []
    let notCompletedItems = []
    let allItems = []
    let lastItemId = null

    if (sorts) {
      sorts.forEach(function(item) {
        if (items[item]) {
          items[item].completed ? completedItems.push(items[item]) : notCompletedItems.push(items[item]);
        }
      })

      lastItemId = notCompletedItems.length ? notCompletedItems[notCompletedItems.length - 1].id : null;

      if(this.state.showDone) {
        allItems = _.union(notCompletedItems, completedItems);
      } else {
        allItems = notCompletedItems;
      }
    }

    let itemsClasses = classNames(
      'todos',
      {'todos--drag-active': nowDragging}
    );

    let itemSectionClasses = classNames(
      'todo-list'
    )

    if (allItems.length) {
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
              {allItems.map(item => (
                <ListItem
                  todo={item}
                  key={this.itemKey(item)}
                  nowEditing={nowEditing}
                  remove={remove}
                  done={done}
                  reorder={reorder}
                  edit={edit}
                  onEdit={onEdit}
                  dragStart={dragStart}
                  dragEnd={dragEnd}
                  activeList={activeList}
                />
              ))}
          </CSSTransitionGroup>
          <ListItemForm
            add={add}
            onEdit={onEdit}
            nowEditing={nowEditing}
            lastItemId={lastItemId}
            activeList={activeList}
          />
        </div>
      )
    } else {
      return (
        <ListItemForm
          add={add}
          onEdit={onEdit}
          nowEditing={nowEditing}
          lastItemId={lastItemId}
          activeList={activeList}
        />
      )
    }
  }
}

listSection.defaultProps = {
  collapsed: true
};
