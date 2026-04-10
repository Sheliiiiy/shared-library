import BookCard from "./BookCard"

export default function BookList({ books, user, onDelete }) {
  const userBooks = books[user]

  const grouped = userBooks.reduce((acc, book) => {
    const genre = book.genre || "Unknown"
    if (!acc[genre]) acc[genre] = []
    acc[genre].push(book)
    return acc
  }, {})

  return (
    <div>
      {Object.keys(grouped).map((genre) => (
        <div key={genre} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{genre}</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {grouped[genre].map((book, i) => (
              <BookCard key={i} book={book} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}