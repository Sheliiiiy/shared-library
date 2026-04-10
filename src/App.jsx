import { useState, useEffect } from "react"
import BookList from "./components/BookList"

// Simple in-browser library app (can later connect to API)
export default function App() {
  const [users] = useState(["GG", "VK"]);
  const [activeUser, setActiveUser] = useState("GG");
  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem("books")

    if (!saved) return { GG: [], VK: [] }

    const parsed = JSON.parse(saved)

    // patch missing ids
    for (const user of ["GG", "VK"]) {
      parsed[user] = parsed[user].map(book => ({
        ...book,
        id: book.id || crypto.randomUUID()
      }))
    }

    return parsed
  });

  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books))
  }, [books])

  const [search, setSearch] = useState("")
  const [results, setResults] = useState([])

  const searchBooks = async () => {
    if (!search) return

    const res = await fetch(
      `https://openlibrary.org/search.json?q=${search}`
    )

    const data = await res.json()
    setResults(data.docs.slice(0, 8))
  }

  const groupedBooks = books[activeUser].reduce((acc, book) => {
    const genre = book.genre || "Unknown"
    if (!acc[genre]) acc[genre] = []
    acc[genre].push(book)
    return acc;
  }, {});

  const deleteBook = (user, id) => {
    setBooks(prev => ({
      ...prev,
      [user]: prev[user].filter(book => book.id !== id)
    }))
  };
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">📚 Online Library</h1>

      {/* User Switch */}
      <div className="flex gap-2 mb-6">
        {users.map((user) => (
          <button
            key={user}
            onClick={() => setActiveUser(user)}
            className={`px-4 py-2 rounded-2xl shadow ${activeUser === user ? "bg-black text-white" : "bg-gray-200"}`}
          >
            {user}
          </button>
        ))}
      </div>

      {/* Search Book */}
      <div className="mb-6">
        <input
          className="p-2 border rounded w-full"
          placeholder="Search books (Harry Potter, Naruto...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={searchBooks}
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
        >
          Search Books
        </button>
      </div>

      {/* P2 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {results.map((book, i) => (
          <div key={i} className="border p-3 rounded">
            <img
              src={
                book.cover_i
                  ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                  : ""
              }
              className="h-40 w-full object-cover mb-2"
            />

            <h3 className="font-bold text-sm">
              {book.title}
            </h3>

            <p className="text-xs text-gray-600">
              {book.author_name?.[0]}
            </p>

            <button
              onClick={() =>
                setBooks(prev => ({
                  ...prev,
                  [activeUser]: [
                    ...prev[activeUser],
                    {
                      id: crypto.randomUUID(),
                      title: book.title,
                      author: book.author_name?.[0] || "Unknown",
                      genre: book.subject?.[0] || "Unknown",
                      image: book.cover_i
                        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                        : "",
                      user: activeUser
                    }
                  ]
                }))
              }
              className="mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded"
            >
              Add
            </button>
          </div>
        ))}
      </div>

      {/* Books Display */}
      <BookList
        books={books}
        user={activeUser}
        onDelete={deleteBook}
      />
    </div>
  );
}