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
  // Create API fetch / promise
  let item = Api.updateListItem({id, idx_position: to})

  return (dispatch) => {
    // Immediately update sort collection
    dispatch(reorder(from, to, listId));

    // Await API call response
    item.then(response => {
      response.json().then(response => {
        // @todo handle errors
      })
    })
  };
}
