import {LOGOUT} from '../actionTypes/actionTypes.js'
import { appReducer } from './app.js';

export const rootReducer = (state, action) => {
  console.log(action)
  // On logout action, clear redux store
  if (action.type === LOGOUT) {
    state = undefined
  }

  return appReducer(state, action)
}
