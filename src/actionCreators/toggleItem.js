import * as Api from '../helpers/api.js';
import { TOGGLE_ITEM } from '../actionTypes/actionTypes.js';
import {incrementTodayBadgeCount} from './incrementTodayBadgeCount.js';
import {decrementTodayBadgeCount} from './decrementTodayBadgeCount.js';

const toggle = (id, completed) => {
  return {
    type: TOGGLE_ITEM,
    id,
    completed
  }
}

export const toggleItem = (id, listId, completed) => {
  return (dispatch, getState) => {
    // Update via API
    Api.updateListItem({id, completed})

    // Immediately toggle item in client collection
    dispatch(toggle(id, completed));

    // If it's a Today item, update the badge count as well
    const {lists} = getState();
    if (lists[listId].title === 'today') {
      completed ? dispatch(decrementTodayBadgeCount()) : dispatch(incrementTodayBadgeCount())
    }
  };
}
