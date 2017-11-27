import {
  SET_NOW_EDITING,
  SET_NOW_DRAGGING,
  SET_NOW_DRAGGING_TO,
  SET_ACITVE_LIST,
  SET_TODAY_BADGE_COUNT
} from '../actionTypes/actionTypes.js';

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

    case SET_NOW_DRAGGING_TO:
      return Object.assign({}, state, {
        nowDraggingTo: action.sectionId
      })

    case SET_ACITVE_LIST:
      return Object.assign({}, state, {
        activeList: action.id
      })

    case SET_TODAY_BADGE_COUNT:
      return Object.assign({}, state, {
        todayBadgeCount: action.count
      })

    default:
      return state
  }
}

const initialState = {
  nowEditing: null,
  nowDragging: false,
  nowDraggingTo: null,
  activeList: null
}
