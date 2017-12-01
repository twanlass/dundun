import * as Api from '../helpers/api.js';
import {
  ADD_ITEM,
  ADD_ITEM_INDEX,
  EDIT_ITEM_INDEX,
  REMOVE_ITEM
} from '../actionTypes/actionTypes.js';
import {incrementTodayBadgeCount} from './incrementTodayBadgeCount.js';

const add = (item) => {
  return {
    type: ADD_ITEM,
    item: {...item}
  }
}

const remove = (id) => {
  return {
    type: REMOVE_ITEM,
    id
  }
}

const addIndex = (id, listId) => {
  return {
    type: ADD_ITEM_INDEX,
    id,
    listId
  }
}

const editIndex = (id, tempId, listId) => {
  return {
    type: EDIT_ITEM_INDEX,
    id,
    tempId,
    listId
  }
}

export const addItem = (title, createdAt, dueAt, isEvent, listId) => {
  // Generate temp id to be used until API returns new item id
  let tempId = 'cid_' + Math.floor(performance.now())

  // Create API fetch / promise
  let item = Api.postListItem({
    'idx_position': 'last',
    'title': title,
    'due_at': dueAt,
    'is_event': isEvent,
    'list_id': listId
  })

  return (dispatch, getState) => {
    // Immediately add item to client collection and the sort index
    dispatch(add({id: tempId, title, created_at: createdAt, due_at: dueAt, is_event: isEvent, list_id: listId, completed: false}));
    dispatch(addIndex(tempId, listId));

    // If it's a Today item, update the badge count as well
    const {lists} = getState();
    if (lists[listId].title === 'today') {
      dispatch(incrementTodayBadgeCount())
    }

    // Await API call response
    item.then(response => {
      response.json().then(response => {
        let item = response.item
        let meta = response.meta

        // Update client collection with real item data returned from API,
        // remove temp collection item and update sort index to point to real item id
        dispatch(add(Object.assign({cid: tempId}, {...item})))
        dispatch(remove(tempId))
        dispatch(editIndex(item.id, tempId, meta.list_id))
      })
    })
  };
}
