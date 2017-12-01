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
    throw new Error("User is not signed in");
  }
}
