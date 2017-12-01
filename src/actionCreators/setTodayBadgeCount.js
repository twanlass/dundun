import { SET_TODAY_BADGE_COUNT } from '../actionTypes/actionTypes.js';

export const setTodayBadgeCount = count => {
  return {
    type: SET_TODAY_BADGE_COUNT,
    count
  }
}
