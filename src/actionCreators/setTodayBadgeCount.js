import _ from 'lodash';
import { SET_TODAY_BADGE_COUNT } from '../actionTypes/actionTypes.js';

const set = count => {
  return {
    type: SET_TODAY_BADGE_COUNT,
    count
  }
}

export const setTodayBadgeCount = (count=null) => {
  return (dispatch, getState) => {
    let state = getState()
    let todayListId = _.filter(state.lists, { 'type': 'today'})[0].id;
    let computedTodayBadgeCount = _.filter(state.items, { 'completed': false, 'list_id': todayListId }).length

    let badgeCount = count ? count : computedTodayBadgeCount;
    dispatch(set(badgeCount))
  }
}
