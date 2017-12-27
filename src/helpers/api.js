import * as Auth from '../helpers/auth.js';

const baseUrl = 'https://api.getdundun.com/v1/'
const headers = () => {
  return {
    'Content-Type': 'application/json',
    'Authorization' : 'bearer ' + Auth.getUserToken()
  }
}

// List Endpoionts
export const getLists = () => {
  return fetchWrapper({
    url: 'lists',
    method: 'GET',
    headers: headers()
  })
}

// Item Endpoints
export const getListItems = listId => {
  return fetchWrapper({
    url: 'lists/' + listId,
    method: 'GET',
    headers: headers()
  })
}

export const postListItem = (item) => {
  return fetchWrapper({
    url: 'items',
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(item)
  })
}

export const updateListItem = (item) => {
  return fetchWrapper({
    url: 'items/' + item.id,
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(item)
  })
}

export const deleteListItem = (id) => {
  return fetchWrapper({
    url: 'items/' + id,
    method: 'DELETE',
    headers: headers()
  })
}

// Auth Endpoints
export const login = (user) => {
  return fetchWrapper({
    url: 'auth',
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({auth: user})
  })
}

// Generic fetch wrapper
const fetchWrapper = (options) => {
  return fetch(baseUrl + options.url, {
    ...options
  })
  .then(response => {
    if (response.status >= 200 && response.status < 300) {
      return response.json();
    }
    throw new ErrorObject(response.status, response.statusText)
  })
  .catch(error => {
    handleError(error)
  })
}

// Error handlers
function ErrorObject (status, statusText) {
  this.status = status;
  this.statusText = statusText;
}

const handleError = (error) => {
  // error object contains `status` and `statusText` properties
  switch (error.status) {
    case 401:
      Auth.logoutUser()
      return

    case 404:
      console.error('404 not found')
      return

    default:
      console.debug('Default error message...')
      console.debug(error.status)
      console.debug(error.statusText)
  }
}
