import React from 'react';
import Moment from 'moment';

export default class TodoDueAtTime extends React.Component {
  render() {
    const {todo} = this.props;

    if (todo.isEvent) {
      return (
        <div className="todo__due-at">{Moment(todo.dueAt).format('h:mm A')}</div>
      )
    } else {
      return null;
    }
  }
}
