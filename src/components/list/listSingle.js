import React from 'react';
import _ from 'lodash';
import Moment from 'moment';
import classNames from 'classnames';
import { CSSTransitionGroup } from 'react-transition-group';
import ListHeader from '../listHeader/listHeader.js'
import ListItem from '../listItem/listItem.js';
import ListItemForm from '../listItemForm/listItemForm.js';
import './list.css';

export default class ListSingle extends React.Component {
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
    const {lists, activeList} = this.props;

    let list = _.filter(lists, { 'id': activeList})[0];
    let date = list.title === 'today' ? Moment().format('dddd MMM Do') : null;

    return (
      <ListHeader
        showDone={this.state.showDone}
        toggleShowDone={this.toggleShowDone.bind(this)}
        title={list.title}
        date={date}
      />
    )
  }

  // If a temp client id (cid) exists, use that as the key to
  // avoid rendering an item twice (temp item, and real API returned item)
  itemKey(item) {
    return item.cid ? item.cid : item.id;
  }

  handleDragStart(e) {
    const {onDrag} = this.props;
    onDrag(true)

    this.dragged = e.currentTarget;
    e.dataTransfer.effectAllowed = 'move';
    // Firefox requires dataTransfer data to be set
    e.dataTransfer.setData("text/html", e.currentTarget);
  }

  handleDragOver(e) {
    const {onDragTo} = this.props;

    let nowDraggingTo = null;
    let prevDraggingTo = this.props.nowDraggingTo;

    e.preventDefault();
    this.dragged.style.display = "none";

    // Which list is the currently dragged item over?
    if (e.target.classList.contains('todos')) {
      nowDraggingTo = e.target.getAttribute('data-id')
    } else {
      nowDraggingTo = e.target.parentElement.getAttribute('data-id')
    }

    // Prevent state update (and render) if we're still dragging around in the same list...
    if (prevDraggingTo !== nowDraggingTo) {
      onDragTo(nowDraggingTo)
    }

    // If we're dragging over a placeholder, don't update the target yet
    if(e.target.className === "todo--placeholder") return;
    this.over = e.target;

    // Check if we're dropping beyond the start or end of the list
    let relY = e.clientY - this.over.offsetTop;
    let height = this.over.offsetHeight / 2;
    let parent = e.target.parentNode;

    if(relY > height) {
      this.nodePlacement = "after";
      parent.insertBefore(placeholder, e.target.nextElementSibling);
    }
    else if(relY < height) {
      this.nodePlacement = "before"
      parent.insertBefore(placeholder, e.target);
    }
  }

  handleDragEnd(e) {
    const { itemOrder, onDrag, reorder, activeList } = this.props;
    onDrag(false)

    this.dragged.style.display = "flex";

    // Remove temp placeholder element
    document.getElementById('todo--placeholder').outerHTML='';

    let data = itemOrder[activeList];
    let from = Number(this.dragged.dataset.id);
    let to = Number(this.over.dataset.id);

    let fromIndex = data.indexOf(from)
    let toIndex = data.indexOf(to)

    reorder(from, fromIndex, toIndex, activeList)
  }

  render() {
    const {items, itemOrder, nowEditing, nowCompleting, nowDragging, add, remove, done, onDone, reorder, edit, onEdit, activeList}  = this.props;

    let order = itemOrder[activeList];
    let listItems = []
    let lastItemId = null

    if (order) {
      order.forEach(function(item) {
        if (items[item]) {
          listItems.push(items[item])
        }
      })

      if (!this.state.showDone) {
        listItems = listItems.filter(item => !item.completed);
      }

      lastItemId = listItems.length ? listItems[listItems.length - 1].id : null;
    }

    let itemsClasses = classNames(
      'todos',
      {'todos--drag-active': nowDragging}
    );

    if (itemOrder[activeList]) {
      return (
        <div className="todo-list">
          {this.renderListSectionHeader()}
          <CSSTransitionGroup
            transitionName="todo-"
            component="div"
            className={itemsClasses}
            data-id={this.props.title}
            onDragOver={this.handleDragOver.bind(this)}
            transitionEnterTimeout={250}
            transitionLeaveTimeout={150}>
            {listItems.map(item => (
              <ListItem
                todo={item}
                key={this.itemKey(item)}
                nowEditing={nowEditing}
                nowCompleting={nowCompleting}
                remove={remove}
                done={done}
                onDone={onDone}
                reorder={reorder}
                edit={edit}
                onEdit={onEdit}
                dragStart={this.handleDragStart.bind(this)}
                dragEnd={this.handleDragEnd.bind(this)}
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
      return null;
    }
  }
}

// Create placeholder div for drag / drop
const placeholder = document.createElement('div');
placeholder.className = 'todo--placeholder';
placeholder.id = 'todo--placeholder';
