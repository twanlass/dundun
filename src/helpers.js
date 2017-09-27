import Moment from 'moment';

export const isFuture = todo => Moment(todo.dueAt).isAfter(Moment().valueOf(), 'day');
export const isToday = todo => Moment(todo.dueAt).isSame(Moment().valueOf(), 'day');
export const isPast = todo => Moment(todo.dueAt).isBefore(Moment().valueOf(), 'day');

export const isCompletedToday = todo => Moment(todo.completedAt).isSame(Moment().valueOf(), 'day');
export const isCompletedYesterday = todo => Moment(todo.completedAt).isSame(Moment().subtract(1, 'd').valueOf(), 'day');

export const isComplete = todo => todo.completed;
export const isNotComplete = todo => !todo.completed;

export const sortDesc = (a,b) => b.id - a.id;
export const sortAsc = (a,b) =>  a.id - b.id;
