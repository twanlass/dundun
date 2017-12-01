import {
  RECEIVE_LISTS,
} from '../actionTypes/actionTypes.js';

export const listOrder = (state = [], action) => {

  switch (action.type) {
    case RECEIVE_LISTS:
      return [...action.sortOrder]

    default:
      return state
  }
}
