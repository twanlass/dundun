import Moment from 'moment';
import * as Api from '../helpers/api.js';
import { TOGGLE_ITEM } from '../actionTypes/actionTypes.js';
import {incrementTodayBadgeCount} from './incrementTodayBadgeCount.js';
import {decrementTodayBadgeCount} from './decrementTodayBadgeCount.js';

const toggle = (id, completed) => {
  return {
    type: TOGGLE_ITEM,
    id,
    completed,
    completed_at: Moment.utc().format()
  }
}

export const toggleItem = (id, listId, completed) => {
  // Create API fetch / promise
  let item = Api.updateListItem({id, completed})

  return (dispatch, getState) => {
    // Immediately toggle item in client collection
    dispatch(toggle(id, completed));

    // If it's a Today item, update the badge count as well
    const {lists} = getState();
    if (lists[listId].title === 'today') {
      completed ? dispatch(decrementTodayBadgeCount()) : dispatch(incrementTodayBadgeCount())
    }

    // Await API call response
    item.then(response => {
      response.json().then(response => {
        // @todo handle errors
      })
    })
  };
}
