import { MOVE_TODO } from '../actionTypes/actionTypes.js';

export const moveTodo = (from, to) => {
  return {
    type: MOVE_TODO,
    from,
    to
  }
}
