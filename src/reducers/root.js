import { combineReducers } from 'redux';
import { items } from './items.js';
import { state } from './state.js';

export const rootReducer = combineReducers({
  items,
  state
})
