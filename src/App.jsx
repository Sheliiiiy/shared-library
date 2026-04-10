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

  const searchBooks = async (value) => {
    if (!value) {
      setResults([])
      return
    }

    const res = await fetch(
      `https://openlibrary.org/search.json?q=${value}`
    )

    const data = await res.json()
    setResults(data.docs.slice(0, 6))
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
          placeholder="Search books..."
          value={search}
          onChange={(e) => {
            const value = e.target.value
            setSearch(value)
            searchBooks(value)
          }}
        />

      </div>

      {/* P2 */}
      {results.length > 0 && (
        <div className="relative">
          <div className="absolute z-10 w-full bg-white border rounded shadow-lg max-h-80 overflow-auto"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {results.map((book, i) => (
              <div
                key={i}
                className="p-2 hover:bg-gray-100 cursor-pointer flex gap-2"
                onClick={() => {
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

                  // CLEAR EVERYTHING AFTER SELECT
                  setSearch("")
                  setResults([])
                }}
              >
                <img
                  src={
                    book.cover_i
                      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`
                      : ""
                  }
                  className="h-10 w-8 object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Books Display */}
      <BookList
        books={books}
        user={activeUser}
        onDelete={deleteBook}
      />
    </div>
  );
}