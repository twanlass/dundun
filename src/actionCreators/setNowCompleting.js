import { SET_NOW_COMPLETING } from '../actionTypes/actionTypes.js';

export const setNowCompleting = id => {
  return {
    type: SET_NOW_COMPLETING,
    id
  }
}
