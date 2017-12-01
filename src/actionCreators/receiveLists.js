import { RECEIVE_LISTS } from '../actionTypes/actionTypes.js';

export const receiveLists = (lists, sortOrder) => {
  return {
    type: RECEIVE_LISTS,
    lists,
    sortOrder
  }
}
