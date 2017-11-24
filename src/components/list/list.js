import React from 'react';
import { isToday, isFuture, isPast, isComplete } from '../../helpers/helpers.js';
import ListSection from '../../components/listSection/listSection.js';

export default class List extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.activeList !== this.props.activeList) {
      this.props.getListItems(nextProps.activeList)
    }
  }

  // handleMove(id, list) {
  //   // list: future, today, past
  //   // @todo preserve dueAt time if exists
  //   let data = this.props.items;
  //   let todoIndex = data.findIndex(todo => todo.id === id);
  //
  //   if (list === 'future') {
  //     data[todoIndex].dueAt = Moment().add(1, 'd').valueOf();
  //   } else if (list === 'today') {
  //     data[todoIndex].dueAt = Moment().valueOf();
  //   } else if (list === 'past') {
  //     data[todoIndex].dueAt = Moment().subtract(1, 'd').valueOf();
  //   }
  //
  //   this.setState({ data: data });
  //   this.saveState(data);
  // }

  handleDragStart(e) {
    const { sorts, onDrag, onDragFrom, reorder, activeList } = this.props;
    onDrag(true)

    this.dragged = e.currentTarget;

    // Get the list we're dragging from based on the currently draged todo
    let data = sorts[activeList];
    let draggedTodo = data.filter(todo => todo.id === Number(e.currentTarget.dataset.id));
    let nowDraggingFrom = draggedTodo.some(isToday) ? 'today' : 'future';
    onDragFrom(nowDraggingFrom)

    e.dataTransfer.effectAllowed = 'move';
    // Firefox requires dataTransfer data to be set
    e.dataTransfer.setData("text/html", e.currentTarget);
  }

  handleDragOver(e) {
    const { onDragTo } = this.props;

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
    const { sorts, onDrag, reorder, activeList } = this.props;
    onDrag(false)

    this.dragged.style.display = "flex";

    // Remove temp placeholder element
    document.getElementById('todo--placeholder').outerHTML='';

    let data = sorts[activeList];
    let from = Number(this.dragged.dataset.id);
    let to = Number(this.over.dataset.id);

    let fromIndex = data.indexOf(from)
    let toIndex = data.indexOf(to)

    // Return the todo being dragged and the todo it's dropped on
    let origin = this.props.nowDraggingFrom;
    let destination = this.props.nowDraggingTo;

    // console.log(origin)
    // console.log(destination)

    // @todo - If we're dragging from the today list to the future list, 'move' the todo as well
    // by calling a separate dispatch after the move event
    // let sectionId = origin == destination ? null : destination;

    reorder(from, fromIndex, toIndex, activeList)
  }

  render() {
    const {activeList} = this.props;

    if (activeList) {
      return (
        <ListSection
          key='today'
          title='today'
          items={this.props.items}
          sorts={this.props.sorts[activeList]}
          add={this.props.add.bind(this)}
          edit={this.props.edit.bind(this)}
          done={this.props.done.bind(this)}
          reorder={this.props.reorder.bind(this)}
          remove={this.props.remove.bind(this)}
          onEdit={this.props.onEdit.bind(this)}
          dragStart={this.handleDragStart.bind(this)}
          dragEnd={this.handleDragEnd.bind(this)}
          dragOver={this.handleDragOver.bind(this)}
          nowEditing={this.props.nowEditing}
          nowDragging={this.props.nowDragging}
          nowDraggingFrom={this.props.nowDragging}
          nowDraggingTo={this.props.nowDragging}
          activeList={this.props.activeList}
        />
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
