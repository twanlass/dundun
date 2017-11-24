import fetch from 'isomorphic-fetch';
import * as Api from '../helpers/api.js';
import {receiveListItems} from './receiveListItems.js';

export const getListItems = listId => {
  let items = Api.getListItems(listId)

  return (dispatch) => {
    items.then(response => {
      response.json().then(response => {
        dispatch(receiveListItems(listId, response.list.items, response.meta.sort_order))
      })
    })
  };
}
