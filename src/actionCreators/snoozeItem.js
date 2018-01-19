import * as Api from '../helpers/api.js';
import { SNOOZE_ITEM } from '../actionTypes/actionTypes.js';
import {decrementTodayBadgeCount} from './decrementTodayBadgeCount.js';

const snooze = (id) => {
  return {
    type: SNOOZE_ITEM,
    id
  }
}

export const snoozeItem = (id, due_at, list_id) => {
  return (dispatch) => {
    // Update via API
    Api.updateListItem({id, due_at, list_id})

    // Immediately edit item in client collection
    dispatch(snooze(id));
    dispatch(decrementTodayBadgeCount());
  };
}
