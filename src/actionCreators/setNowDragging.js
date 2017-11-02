import { SET_NOW_DRAGGING } from '../actionTypes/actionTypes.js';

export const setNowDragging = bool => {
  return {
    type: SET_NOW_DRAGGING,
    nowDragging: bool
  }
}
