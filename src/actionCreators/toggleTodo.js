import { TOGGLE_TODO } from '../actionTypes/actionTypes.js';
import Moment from 'moment';

export const toggleTodo = id => {
  return {
    type: TOGGLE_TODO,
    id: id,
    completed_at: Moment().valueOf()
  }
}
