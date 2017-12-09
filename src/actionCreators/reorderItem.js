import * as Api from '../helpers/api.js';
import {
  REORDER_ITEM_INDEX
 } from '../actionTypes/actionTypes.js';

const reorder = (from, to, listId) => {
   return {
     type: REORDER_ITEM_INDEX,
     from,
     to,
     listId
   }
 }

export const reorderItem = (id, from, to, listId) => {
  return (dispatch) => {
    // Update via API
    Api.updateListItem({id, idx_position: to})

    // Immediately update sort collection
    dispatch(reorder(from, to, listId));
  };
}
