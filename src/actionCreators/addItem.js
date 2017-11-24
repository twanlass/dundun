import Moment from 'moment';
import cuid from 'cuid';
import * as Api from '../helpers/api.js';
import {
  ADD_ITEM,
  ADD_ITEM_INDEX,
  EDIT_ITEM,
  REMOVE_TODO
} from '../actionTypes/actionTypes.js';

const add = (id, title, createdAt, dueAt, isEvent, listId) => {
  return {
    type: ADD_ITEM,
    completed: false,
    id,
    title,
    createdAt,
    dueAt,
    isEvent,
    listId
  }
}

const addIndex = (id, listId) => {
  return {
    type: ADD_ITEM_INDEX,
    id,
    listId
  }
}

const edit = (item, id) => {
  return {
    type: EDIT_ITEM,
    id,
    item: {
      id: item.id,
      idx: item.idx
    }
  }
}

export const addItem = (title, createdAt, dueAt, isEvent, listId) => {
  // Generate temp id to be used until API returns new item id
  let tempId = cuid();

  // Create API fetch / promise
  let item = Api.postListItem({
    'temp_id': tempId,
    'idx_position': 'last',
    'title': title,
    'due_at': dueAt,
    'is_event': isEvent,
    'list_id': listId
  })

  return (dispatch) => {
    // Immediately add item to client collection and the sort index
    dispatch(add(tempId, title, createdAt, dueAt, isEvent, listId));
    dispatch(addIndex(tempId, listId));

    // Await API call response
    item.then(response => {
      response.json().then(response => {
        let item = response.item
        let meta = response.meta

        // Update client collection with real item data returned from API
        dispatch(edit(item, meta.temp_id))
      })
    })
  };
}
