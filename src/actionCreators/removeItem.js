import * as Api from '../helpers/api.js';
import {
  REMOVE_ITEM,
  REMOVE_ITEM_INDEX
} from '../actionTypes/actionTypes.js';
import {decrementTodayBadgeCount} from './decrementTodayBadgeCount.js';

const remove = (id) => {
  return {
    type: REMOVE_ITEM,
    id
  }
}

const removeIndex = (id, listId) => {
  return {
    type: REMOVE_ITEM_INDEX,
    id,
    listId
  }
}

export const removeItem = (id, listId) => {
  return (dispatch, getState) => {
    // Update via API
    Api.deleteListItem(id)

    // Immediately remove item from client collection and sort index
    dispatch(remove(id))
    dispatch(removeIndex(id, listId))

    // If it's a Today item, update the badge count as well
    const {lists} = getState();
    if (lists[listId].title === 'today') {
      dispatch(decrementTodayBadgeCount());
    }
  };
}
