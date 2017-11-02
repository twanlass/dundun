import { SET_NOW_EDITING } from '../actionTypes/actionTypes.js';

export const setNowEditing = id => {
  return {
    type: SET_NOW_EDITING,
    id
  }
}
