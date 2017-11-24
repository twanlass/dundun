import * as Auth from '../helpers/auth.js';

const baseUrl = 'http://localhost:3001/v1/'
const token = 'Bearer ' + Auth.getUserToken();
const headers = {
  'Content-Type': 'application/json',
  'Authorization' : token
}

export const getLists = () => {
  return fetch(baseUrl + 'lists', {
    method: 'GET',
    headers: headers
  })
}

export const getListItems = listId => {
  return fetch(baseUrl + 'lists/' + listId, {
    method: 'GET',
    headers: headers
  })
}

export const postListItem = (item) => {
  return fetch(baseUrl + 'items', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(item)
  })
}

export const updateListItem = (item) => {
  return fetch(baseUrl + 'items/' + item.id, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(item)
  })
}

export const deleteListItem = (id) => {
  return fetch(baseUrl + 'items/' + id, {
    method: 'DELETE',
    headers: headers
  })
}
