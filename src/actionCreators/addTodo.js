import { ADD_TODO } from '../actionTypes/actionTypes.js';

let nextTodoId = 2

export const addTodo = (title, due_at, is_event) => {
  return {
    type: ADD_TODO,
    completed: false,
    id: nextTodoId++,
    title,
    due_at,
    is_event
  }
}
