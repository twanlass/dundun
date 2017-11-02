import { REMOVE_TODO } from '../actionTypes/actionTypes.js';

export const removeTodo = id => {
  return {
    type: REMOVE_TODO,
    id: id
  }
}
