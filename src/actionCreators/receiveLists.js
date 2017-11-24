import { RECEIVE_LISTS } from '../actionTypes/actionTypes.js';

export const receiveLists = lists => {
  return {
    type: RECEIVE_LISTS,
    lists: lists
  }
}
