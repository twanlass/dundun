import {
  RECEIVE_LIST_ITEMS,
  ADD_ITEM_INDEX,
  EDIT_ITEM_INDEX,
  REORDER_ITEM_INDEX,
  REMOVE_ITEM_INDEX
} from '../actionTypes/actionTypes.js';

export const sorts = (state = [], action) => {
  let newState;
  let index;

  switch (action.type) {
    case RECEIVE_LIST_ITEMS:
      return Object.assign({}, state, {
        [action.listId]: action.sortOrder
      })

    case ADD_ITEM_INDEX:
      newState = Object.assign({}, state);
      newState[action.listId].push(action.id)
      return newState

    case EDIT_ITEM_INDEX:
      newState = Object.assign({}, state);
      index = newState[action.listId].indexOf(action.tempId);
      newState[action.listId][index] = action.id
      return newState;

    case REORDER_ITEM_INDEX:
      newState = Object.assign({}, state);
      console.log(newState[action.listId])
      let newSortArray = move(newState[action.listId], action.from, action.to)
      console.log(newSortArray)
      newState[action.listId] = newSortArray
      return newState

    case REMOVE_ITEM_INDEX:
      newState = Object.assign({}, state);
      index = newState[action.listId].indexOf(action.id);
      newState[action.listId].splice(index, 1);
      return newState

    default:
      return state
  }
}

function move(arr, old_index, new_index) {
    while (old_index < 0) {
        old_index += arr.length;
    }
    while (new_index < 0) {
        new_index += arr.length;
    }
    if (new_index >= arr.length) {
        var k = new_index - arr.length;
        while ((k--) + 1) {
            arr.push(undefined);
        }
    }
     arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
   return arr;
}
