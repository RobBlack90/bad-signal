
function getCurrentUser() {
  return JSON.parse(window.sessionStorage.getItem('currentUser'))
}
function setCurrentUser(user) {
  return window.sessionStorage.setItem('currentUser', JSON.stringify(user))
}

export default {
  getCurrentUser,
  setCurrentUser
}
