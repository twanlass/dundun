import {
  ADD_ITEM,
  EDIT_ITEM,
  REORDER_ITEM,
  TOGGLE_ITEM,
  REMOVE_ITEM,
  RECEIVE_LIST_ITEMS
} from '../actionTypes/actionTypes.js';

export const items = (state = initialItems, action) => {
  console.log(action)
  let newState;

  switch (action.type) {
    case ADD_ITEM:
      newState = Object.assign({}, state);
      newState[action.id] = {
        id: action.id,
        title: action.title,
        created_at: action.createdAt,
        completed: false,
        completed_at: null,
        due_at: action.dueAt,
        is_event: action.isEvent,
        list_id: action.listId
      }
      return newState

    case EDIT_ITEM:
      newState = Object.assign({}, state);
      newState[action.id] = Object.assign(newState[action.id], {...action.item})
      return newState

    case REMOVE_ITEM:
      newState = Object.assign({}, state);
      delete newState[action.id]
      return newState

    case TOGGLE_ITEM:
      newState = Object.assign({}, state);
      let completed = newState[action.id].completed
      newState[action.id].completed = !completed
      newState[action.id].completed_at = completed ? action.completed_at : newState[action.id].completed_at
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
