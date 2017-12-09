import * as Auth from '../helpers/auth.js';

const baseUrl = 'http://localhost:3001/v1/'
const headers = () => {
  return {
    'Content-Type': 'application/json',
    'Authorization' : 'bearer ' + Auth.getUserToken()
  }
}

// List Endpoionts
export const getLists = () => {
  return fetch(baseUrl + 'lists', {
    method: 'GET',
    headers: headers()
  })
  .then(response => {
    if (response.status === 200) {
      return response.json();
    }
    throw new ErrorObject(response.status, response.statusText)
  })
  .catch(error => {
    handleError(error)
  })
}

// Item Endpoints
export const getListItems = listId => {
  return fetch(baseUrl + 'lists/' + listId, {
    method: 'GET',
    headers: headers()
  })
  .then(response => {
    if (response.status === 200) {
      return response.json();
    }
    throw new ErrorObject(response.status, response.statusText)
  })
  .catch(error => {
    handleError(error)
  })
}

export const postListItem = (item) => {
  return fetch(baseUrl + 'items', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(item)
  })
  .then(response => {
    if (response.status === 200) {
      return response.json();
    }
    throw new ErrorObject(response.status, response.statusText)
  })
  .catch(error => {
    handleError(error)
  })
}

export const updateListItem = (item) => {
  return fetch(baseUrl + 'items/' + item.id, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(item)
  })
  .then(response => {
    if (response.status === 200) {
      return response.json();
    }
    throw new ErrorObject(response.status, response.statusText)
  })
  .catch(error => {
    handleError(error)
  })
}

export const deleteListItem = (id) => {
  return fetch(baseUrl + 'items/' + id, {
    method: 'DELETE',
    headers: headers()
  })
  .then(response => {
    if (response.status === 200) {
      return response.json();
    }
    throw new ErrorObject(response.status, response.statusText)
  })
  .catch(error => {
    handleError(error)
  })
}

// Auth Endpoints
export const login = (user) => {
  return fetch(baseUrl + 'auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({auth: user})
  })
  .then(response => {
    if (response.status === 201) {
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
