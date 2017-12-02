import React from 'react';
import Moment from 'moment';
import classNames from 'classnames';
import {isFuture, isToday, isPast} from '../../helpers/helpers.js';
import './listItemDate.css';

export default class ListItemDate extends React.Component {
  renderTime(todo) {
    return Moment(todo.due_at).format('h:mm A')
  }

  renderDay(todo) {
    return Moment(todo.due_at).format('ddd MMM DD')
  }

  renderDayAndTime(todo) {
    return Moment(todo.due_at).format('ddd MMM DD – h:mm A')
  }

  render() {
    const {todo} = this.props;
    let dateString;

    let listItemDateClasses = classNames(
      'list-item-date',
      {'list-item-date--completed': todo.completed}
    );

    // An event item today
    if (todo.is_event && isToday(todo)) {
      dateString = this.renderTime(todo)
    // An event item in the past
    } else if (todo.is_event && isPast(todo)) {
      dateString = this.renderTime(todo)
    // A future event item
    } else if (todo.is_event && isFuture(todo)) {
      dateString = this.renderTime(todo)
    } else {
      return null;
    }

    if (dateString) {
      return (
        <div className={listItemDateClasses}>{dateString}</div>
      )
    } else {
      return null;
    }
  }
}
