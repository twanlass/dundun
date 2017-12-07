import { combineReducers } from 'redux';
import { lists } from './lists.js';
import { listOrder } from './listOrder.js';
import { items } from './items.js';
import { itemOrder } from './itemOrder.js';
import { state } from './state.js';

export const appReducer = combineReducers({
  lists,
  listOrder,
  items,
  itemOrder,
  state
})
