import React from 'react';
import _ from 'lodash';
import Moment from 'moment';
import classNames from 'classnames';
import { CSSTransitionGroup } from 'react-transition-group';
import ListHeader from '../listHeader/listHeader.js'
import ListItem from '../listItem/listItem.js';
import './list.css';

export default class ListDone extends React.Component {
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

  itemsByDay() {
    const {items, itemOrder, activeList} = this.props;

    let days = []
    let upcomingItems = _.filter(items, function(i) {
      return itemOrder[activeList].includes(i.id)
    });

    for (var i = 1; i < 8; i++) {
      let day = Moment().subtract(i, 'day');
      let dueToday = _.filter(upcomingItems, function(i) {
        return Moment(i.completed_at).isSame(day.valueOf(), 'day')
      });

      // Skip days with no done items
      // if (dueToday.length) {
        let title = i === 1 ? 'yesterday' : day.format('dddd')

        days.push({
          'title': title,
          'date': day.format('MMM Do'),
          items: dueToday
        })
      // }
    }

    return days;
  }

  render() {
    const {itemOrder, remove, done, onDone, reorder, edit, onEdit, nowEditing, nowCompleting, nowDragging, activeList}  = this.props;

    let itemsClasses = classNames(
      'todos',
      {'todos--drag-active': nowDragging}
    );

    if (itemOrder[activeList]) {
      let days = this.itemsByDay()
      return (
        <div className="todo-lists">
          {days.map(day => (
            <div className="todo-list" key={day.date}>
              <ListHeader
                key={day.date}
                showDone={this.state.showDone}
                toggleShowDone={this.toggleShowDone.bind(this)}
                showToggle={false}
                title={day.title}
                date={day.date}
              />
              <CSSTransitionGroup
                transitionName="todo-"
                component="div"
                className={itemsClasses}
                data-id={this.props.title}
                onDragOver={this.handleDragOver.bind(this)}
                transitionEnterTimeout={250}
                transitionLeaveTimeout={150}>
                {day.items.map(item => (
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
            </div>
          ))}
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
