// Pure helpers — persistence now handled in App.jsx via Firebase

export function addBook(books, book) {
  return [...books, book]
}

export function removeBook(books, id) {
  return books.filter((b) => b.id !== id)
}

export function removeBooksByUser(books, user) {
  return books.filter((b) => b.user !== user)
}
