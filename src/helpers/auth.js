import browserHistory from '../helpers/history.js';

export const setUserToken = (token) => {
  let user = JSON.stringify({'token':token})
  localStorage.setItem('todo-user', user);
  return user.token;
}

export const getUserToken = () => {
  let user = localStorage.getItem('todo-user');
  if (user) {
    return JSON.parse(user).token
  } else {
    browserHistory.push('/login','');
  }
}

export const isLoggedIn = () => {
  let user = localStorage.getItem('todo-user');
  if (!user) {
    logoutUser()
    return false;
  } else {
    return true;
  }
}

export const logoutUser = () => {
  browserHistory.push('/login','');
}
