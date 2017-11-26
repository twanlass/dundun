export const getUserToken = () => {
  let user = localStorage.getItem('todo-user');
  if (user) {
    return JSON.parse(user).token
  } else {
    throw new Error("User is not signed in");
  }
}
