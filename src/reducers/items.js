import {
  ADD_ITEM,
  EDIT_ITEM,
  SNOOZE_ITEM,
  TOGGLE_ITEM,
  REMOVE_ITEM,
  RECEIVE_LIST_ITEMS
} from '../actionTypes/actionTypes.js';

export const items = (state = initialItems, action) => {
  let newState;

  switch (action.type) {
    case ADD_ITEM:
      newState = Object.assign({}, state);
      newState[action.item.id] = {...action.item}
      return newState

    case EDIT_ITEM:
      newState = Object.assign({}, state);
      newState[action.id] = Object.assign(newState[action.id], {...action.item})
      return newState

    case SNOOZE_ITEM:
      newState = Object.assign({}, state);
      delete newState[action.id]
      return newState

    case REMOVE_ITEM:
      newState = Object.assign({}, state);
      delete newState[action.id]
      return newState

    case TOGGLE_ITEM:
      newState = Object.assign({}, state);
      newState[action.id].completed = action.completed
      return newState

    case RECEIVE_LIST_ITEMS:
      return Object.assign({}, state, {
        ...action.items
      })

    default:
      return state
  }
}

const initialItems = []
