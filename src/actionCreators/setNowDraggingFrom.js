import { SET_NOW_DRAGGING_FROM } from '../actionTypes/actionTypes.js';

export const setNowDraggingFrom = sectionId => {
  return {
    type: SET_NOW_DRAGGING_FROM,
    sectionId
  }
}
