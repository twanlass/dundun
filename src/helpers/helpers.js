import Moment from 'moment';

export const isFuture = todo => Moment(todo.due_at).isAfter(Moment().valueOf(), 'day');
export const isToday = todo => Moment(todo.due_at).isSame(Moment().valueOf(), 'day');
export const isPast = todo => Moment(todo.due_at).isBefore(Moment().valueOf(), 'day');

export const isCompletedToday = todo => Moment(todo.completed_at).isSame(Moment().valueOf(), 'day');
export const isCompletedYesterday = todo => Moment(todo.completed_at).isSame(Moment().subtract(1, 'd').valueOf(), 'day');

export const isComplete = todo => todo.completed;
export const isNotComplete = todo => !todo.completed;

// @todo refactor into generic method for sorting by prop
export const sortDesc = (a,b) => b.id - a.id;
export const sortAsc = (a,b) =>  a.id - b.id;

export const sortcreatedAtDesc = (a,b) => b.created_at - a.created_at;
export const sortcreatedAtAsc = (a,b) => a.created_at - b.created_at;

export const sortDueAtDesc = (a,b) => b.due_at - a.due_at;
export const sortDueAtAsc = (a,b) => a.due_at - b.due_at;

export const sortCompletedAtDesc = (a,b) => b.completedAt - a.completedAt;
export const sortCompletedAtAsc = (a,b) => a.completedAt - b.completedAt;

export const sortIdx = (a,b) => b.idx - a.idx;
