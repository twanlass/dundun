import React from 'react';
import classNames from 'classnames';
import Autolinker from 'autolinker';
import ListItemDate from '../listItemDate/listItemDate.js';
import './listItem.css';

export default class ListItem extends React.Component {

  onEnter(id, e) {
    const {edit} = this.props;

    if (e.keyCode === 13) {
      if (!e.target.value)
        return;

      edit(id, e.target.value)
      this.resetNowEditing()
    } else if (e.keyCode === 27) {
      this.resetNowEditing()
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

  onRemove(id) {
    const {remove} = this.props;
    remove(id)
    this.resetNowEditing()
  }

  onDone(id) {
    const {done} = this.props;
    done(id)
    this.resetNowEditing()
  }

  resetNowEditing() {
    const {onEdit} = this.props;
    onEdit(null)
  }

  renderTitle() {
    const {todo, nowEditing} = this.props;

    // Auto-link title + wrap any code in <code/> blocks
    let linkedTitle = Autolinker.link( todo.text, {truncate: { length: 15, location: 'start' }} ).replace(/(`.*?`)/gi, '<code>$&</code>').replace(/`/g,'').replace(/<->/g,'&#8596;').replace(/->/g, '&#8594;').replace(/<-/g, '&#8592;');

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
    const {todo, nowEditing, dragStart, dragEnd} = this.props;

    let todoClasses = classNames(
      'todo',
      {'todo--editing': todo.id === nowEditing},
      {'todo--event': todo.isEvent},
      {'todo--completed': todo.completed}
    );

    let todoActionClasses = classNames(
      'todo__actions',
      {'todo__actions--active': todo.id === nowEditing}
    );

    // If the item id we're editing is null, allow dragging
    let draggable = nowEditing ? false : true;

    return (
      <div className={todoClasses} draggable={draggable} onDragStart={dragStart} onDragEnd={dragEnd} data-id={todo.id}>
        <label id={todo.id}>
          <input type="checkbox" id={todo.id} onClick={() => { this.onDone(todo.id); }} defaultChecked={todo.completed} />
        </label>
        {this.renderTitle()}
        <ListItemDate todo={todo} />
        <div className={todoActionClasses}>
          <i className="ico-trash" onClick={() => { this.onRemove(todo.id); }}></i>
        </div>
      </div>
    );
  };
};
