import React from 'react';
import classNames from 'classnames';
import Autolinker from 'autolinker'
import TodoDueAtTime from './TodoDueAtTime.js';
import TodoDueAtDay from './TodoDueAtDay.js';

export default class Todo extends React.Component {

  onEnter(id, e) {
    const {todo, edit, onEdit} = this.props;

    if (e.keyCode === 13) {
      edit(id, e.target.value)
      onEdit(null)
    } else if (e.keyCode === 27) {
      onEdit(null)
    }
  }

  onFocus(e) {
    // Set cursor to end of input when focused
    let input = e.target;
    let strLength = input.value.length * 2;
    input.focus();
    input.setSelectionRange(strLength, strLength);
  }

  onEdit(e) {
    // Prevent edit if clicking on a link in a todo title
    if (e.target.tagName.toLowerCase() === 'a') {
      return;
    }

    const {todo, onEdit} = this.props;
    onEdit(todo.id)
  }

  renderTitle() {
    const {todo, nowEditing} = this.props;
    let linkedTitle = Autolinker.link( todo.text, {truncate: { length: 15, location: 'start' }} );

    if (todo.id === nowEditing) {
      return (
        <input className="todo__title" type="text" title={todo.id + ' – ' + todo.text} defaultValue={todo.text} autoFocus={true} onFocus={(e) => { this.onFocus(e) }} onKeyUp={(e) => { this.onEnter(todo.id, e) }} />
      )
    } else {
      return (
        <div className="todo__title" title={todo.text} dangerouslySetInnerHTML={{ __html: linkedTitle }} onClick={(e) => {this.onEdit(e)}}></div>
      )
    }
  }

  render() {
    const {todo, nowEditing, remove, done, move, edit, dragStart, dragEnd} = this.props;

    let todoClasses = classNames(
      'todo',
      {'todo--editing': todo.id === nowEditing},
      {'todo--event': todo.isEvent},
      {'todo--completed': todo.completed}
    );

    return (
      <div className={todoClasses} draggable="true" onDragStart={dragStart} onDragEnd={dragEnd} data-id={todo.id}>
        <label id={todo.id}>
          <input type="checkbox" id={todo.id} onClick={() => { done(todo.id); }} defaultChecked={todo.completed} />
        </label>
        {this.renderTitle()}
        <TodoDueAtTime todo={todo} />
        <TodoDueAtDay todo={todo} />
        <div className="todo__actions">
          <div className="todo__remove" onClick={() => { remove(todo.id); }}>&times;</div>
        </div>
      </div>
    );
  };
};
