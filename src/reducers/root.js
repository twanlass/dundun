import { combineReducers } from 'redux';
import { lists } from './lists.js';
import { items } from './items.js';
import { sorts } from './sorts.js';
import { state } from './state.js';

export const rootReducer = combineReducers({
  lists,
  items,
  sorts,
  state
})
