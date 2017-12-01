import * as Api from '../helpers/api.js';
import {receiveListItems} from './receiveListItems.js';
import {setTodayBadgeCount} from './setTodayBadgeCount.js';

export const getListItems = listId => {
  let items = Api.getListItems(listId)

  return (dispatch) => {
    items.then(response => {
      response.json().then(response => {
        let items = response.list.items;
        let meta = response.meta;

        dispatch(receiveListItems(listId, items, meta.sort_order))

        if (response.list.title === 'today') {
          dispatch(setTodayBadgeCount(meta.badge_count))
        }
      })
    })
  };
}
