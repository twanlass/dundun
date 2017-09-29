import React from 'react';

export default class TodoForm extends React.Component {
  onEditPrevious(e) {
    const {onEdit, lastTodoId} = this.props;

    // On up-arrow key, edit previous todo item
    if (e.keyCode === 38) {
      onEdit(lastTodoId)
    }
  }

  onClick() {
    const {onEdit} = this.props;
    onEdit(null);
  }

  onAdd(e) {
    const {add} = this.props;
    e.preventDefault();
    add(this.input.value);
    this.input.value = '';
  }

  render() {
    const {nowEditing} = this.props;
    let input;

    return (
      <div className="todo todo--add">
        <form onSubmit={(e) => { this.onAdd(e) }}>
          <input
            className="todo__add"
            placeholder="Add a new todo..."
            onClick={(e) => {this.onClick()}}
            onKeyUp={(e) => { this.onEditPrevious(e) }}
            ref={(input) => {
              // set reference for onAdd
              this.input = input;
              // if we're not editing another todo, focus input
              if(input && !nowEditing){input.focus()}
            }}
          />
        </form>
      </div>
    )
  }
}
