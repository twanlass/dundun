import { SET_NOW_DRAGGING_TO } from '../actionTypes/actionTypes.js';

export const setNowDraggingTo = sectionId => {
  return {
    type: SET_NOW_DRAGGING_TO,
    sectionId
  }
}
