import { DECREMENT_TODAY_BADGE_COUNT } from '../actionTypes/actionTypes.js';

export const decrementTodayBadgeCount = () => {
  return {
    type: DECREMENT_TODAY_BADGE_COUNT
  }
}
