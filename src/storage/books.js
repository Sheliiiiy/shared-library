const STORAGE_KEY = "book-library"

// Get all books
export function getBooks() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
}

// Save all books
export function saveBooks(books) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books))
}

// Add one book
export function addBook(book) {
  const books = getBooks()
  books.push(book)
  saveBooks(books)
}