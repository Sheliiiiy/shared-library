const USER_KEY = "active-user"

export function setUser(user) {
  localStorage.setItem(USER_KEY, user)
}

export function getUser() {
  return localStorage.getItem(USER_KEY) || "GG"
}