import React from 'react';
import Moment from 'moment';
import chrono from 'chrono-node';
import './listItemForm.css';
import '../../css/todo-icon-font.css';

export default class listItemForm extends React.Component {
  onEditPrevious(e) {
    const {onEdit, lastItemId} = this.props;

    // On up-arrow key, edit previous todo item
    if (e.keyCode === 38) {
      onEdit(lastItemId)
    }
  }

  onClick() {
    const {onEdit} = this.props;
    onEdit(null);
  }

  onAdd(e) {
    e.preventDefault();

    if (!this.input.value)
      return;

    this.handleAdd(this.input.value);
    this.input.value = '';
  }

  handleAdd(val) {
    const {add, activeList} = this.props;

    let title = val;
    // @ todo - need to work out client / server item id creation
    // let id = (new Date()).getTime();
    let NLDate = chrono.parse(val);
    let createdAt = Moment.utc().format();
    let dueAt = null;
    let isEvent = null;

    // If a date string was passed and parsed...
    if (NLDate.length) {
      // Set due date to date passed
      dueAt = Moment(NLDate[0].start.date()).valueOf();

      // Remove any date lanuage from todo title, like tomorrow, Friday, etc
      title = title.replace(NLDate[0].text, '').trim();

      // If an exact hour / minute was passed, this todo is an event (meeting, call, dinner, etc)...
      if (NLDate[0].start.knownValues.hour || NLDate[0].start.knownValues.minute) {
        isEvent = true;
      }
    } else {
      // No due date passed – use creation time as default due date
      dueAt = Moment.utc().format();
    }

    add(title, createdAt, dueAt, isEvent, activeList)
  }


  render() {
    const {nowEditing} = this.props;
    let input;

    return (
      <div className="todo todo--form">
        <form onSubmit={(e) => { this.onAdd(e) }}>
          <i className="ico-return"></i>
          <input
            className="list-item-form"
            placeholder="What's next?"
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
