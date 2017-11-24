import { RECEIVE_LIST_ITEMS } from '../actionTypes/actionTypes.js';

export const receiveListItems = (listId, items, sortOrder) => {
  return {
    type: RECEIVE_LIST_ITEMS,
    listId,
    items,
    sortOrder
  }
}
