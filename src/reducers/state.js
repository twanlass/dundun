import { SET_NOW_EDITING, SET_NOW_DRAGGING, SET_NOW_DRAGGING_FROM, SET_NOW_DRAGGING_TO } from '../actionTypes/actionTypes.js';

export const state = (state = initialState, action) => {
  switch (action.type) {
    case SET_NOW_EDITING:
      return Object.assign({}, state, {
        nowEditing: action.id
      })

    case SET_NOW_DRAGGING:
      return Object.assign({}, state, {
        nowDragging: action.nowDragging
      })

    case SET_NOW_DRAGGING_FROM:
      return Object.assign({}, state, {
        nowDraggingFrom: action.sectionId
      })

    case SET_NOW_DRAGGING_TO:
      return Object.assign({}, state, {
        nowDraggingTo: action.sectionId
      })

    default:
      return state
  }
}

const initialState = {
  nowEditing: null,
  nowDragging: false,
  nowDraggingFrom: null,
  nowDraggingTo: null
}
