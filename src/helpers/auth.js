import browserHistory from '../helpers/history.js';

export const setUserToken = (token) => {
  let user = JSON.stringify({'token':token})
  localStorage.setItem('todo-user', user);
  return user.token;
}

export const getUserToken = () => {
  console.log('get user token...')
  let user = localStorage.getItem('todo-user');
  if (user) {
    return JSON.parse(user).token
  } else {
    browserHistory.push('/login','');
  }
}
