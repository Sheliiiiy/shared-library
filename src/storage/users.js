const ACTIVE_USER_KEY = "active-user"

export function getActiveUser() {
  return localStorage.getItem(ACTIVE_USER_KEY)
}

export function setActiveUser(user) {
  localStorage.setItem(ACTIVE_USER_KEY, user)
}

export function addUser(users, name) {
  const trimmed = name.trim()
  if (!trimmed || users.includes(trimmed)) return users
  return [...users, trimmed]
}

export function removeUser(users, name) {
  const next = users.filter((u) => u !== name)
  if (next.length === 0) {
    return ["GG", "VK"]
  }
  return next
}

