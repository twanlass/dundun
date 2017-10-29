import Moment from 'moment';

export const isFuture = todo => Moment(todo.dueAt).isAfter(Moment().valueOf(), 'day');
export const isToday = todo => Moment(todo.dueAt).isSame(Moment().valueOf(), 'day');
export const isPast = todo => Moment(todo.dueAt).isBefore(Moment().valueOf(), 'day');

export const isCompletedToday = todo => Moment(todo.completedAt).isSame(Moment().valueOf(), 'day');
export const isCompletedYesterday = todo => Moment(todo.completedAt).isSame(Moment().subtract(1, 'd').valueOf(), 'day');

export const isComplete = todo => todo.completed;
export const isNotComplete = todo => !todo.completed;

// @todo refactor into generic method for sorting by prop
export const sortDesc = (a,b) => b.id - a.id;
export const sortAsc = (a,b) =>  a.id - b.id;

export const sortCreatedAtDesc = (a,b) => b.createdAt - a.createdAt;
export const sortCreatedAtAsc = (a,b) => a.createdAt - b.createdAt;

export const sortDueAtDesc = (a,b) => b.dueAt - a.dueAt;
export const sortDueAtAsc = (a,b) => a.dueAt - b.dueAt;

export const sortCompletedAtDesc = (a,b) => b.completedAt - a.completedAt;
export const sortCompletedAtAsc = (a,b) => a.completedAt - b.completedAt;
