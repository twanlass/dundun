import React from 'react';
import Moment from 'moment';
import {isFuture} from './helpers.js';

export default class TodoDueAtDay extends React.Component {
  render() {
    const {todo} = this.props;

    if (isFuture(todo)) {
      return (
        <div className="todo__due-at">{Moment(todo.dueAt).format('ddd MMM DD')}</div>
      )
    } else {
      return null;
    }
  }
}
