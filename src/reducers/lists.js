import { RECEIVE_LISTS } from '../actionTypes/actionTypes.js';

export const lists = (state = initialLists, action) => {
  switch (action.type) {
    case RECEIVE_LISTS:
      return Object.assign({}, state, {
        ...action.lists
      })

    default:
      return state
  }
}

const initialLists = []
