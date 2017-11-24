import { SET_ACITVE_LIST } from '../actionTypes/actionTypes.js';

export const setActiveList = id => {
  return {
    type: SET_ACITVE_LIST,
    id
  }
}
