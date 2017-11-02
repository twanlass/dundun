import { EDIT_TODO } from '../actionTypes/actionTypes.js';

export const editTodo = (title, id) => {
  return {
    type: EDIT_TODO,
    title,
    id
  }
}
