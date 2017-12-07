import browserHistory from '../helpers/history.js';
import { LOGOUT } from '../actionTypes/actionTypes.js';

const logout = () => {
  return {
    type: LOGOUT
  }
}

export function logoutUser() {
  return (dispatch) => {
    // Clear redux store
    dispatch(logout())

    // Clear local storage (API token, etc)
    localStorage.removeItem('todo-user');

    // Finally route user to /login
    browserHistory.push('/login','');
  }
}
