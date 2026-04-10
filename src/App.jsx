import { useRef, useState, useEffect } from "react"
import BookList from "./components/BookList"

// Simple in-browser library app (can later connect to API)
export default function App() {
  const timeoutRef = useRef(null)
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

  const sortedGenres = Object.keys(groupedBooks).sort(
    (a, b) => (a === "Unknown" ? 1 : b === "Unknown" ? -1 : 0)
  )

  const deleteBook = (user, id) => {
    setBooks(prev => ({
      ...prev,
      [user]: prev[user].filter(book => book.id !== id)
    }))
  };
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h1 className="text-3xl font-bold mb-4">📚 Online Library</h1>

        <div className="mb-4 text-sm text-gray-600">
          Currently viewing library for:{" "}
          <span className="font-semibold text-black">
            {activeUser}
          </span>
        </div>

        {/* User Switch */}
        <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-full shadow-sm">
          <span className="text-xs text-gray-500 mr-1">User</span>

          {users.map((user) => {
            const isActive = activeUser === user;

            return (
              <button
                key={user}
                onClick={() => setActiveUser(user)}
                className={`
            px-3 py-1 rounded-full text-xs font-medium transition-all duration-200
            ${isActive
                    ? "bg-black text-white shadow"
                    : "text-gray-600 hover:bg-white"
                  }
          `}
              >
                {user}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Book */}
      {/* SEARCH + DROPDOWN WRAPPER */}
      <div className="relative mb-6">

        <input
          className="p-2 border rounded w-full"
          placeholder="Search books..."
          value={search}
          onChange={(e) => {
            const value = e.target.value
            setSearch(value)

            if (timeoutRef.current) clearTimeout(timeoutRef.current)

            timeoutRef.current = setTimeout(() => {
              searchBooks(value)
            }, 400)
          }}
        />

        {/* DROPDOWN MUST BE INSIDE SAME DIV */}
        {results.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1 z-[99999] bg-white border rounded shadow-lg max-h-80 overflow-auto">
            {results.map((book, i) => (
              <div
                key={i}
                className="p-2 hover:bg-gray-100 cursor-pointer flex gap-3 items-center"
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
                  className="h-12 w-10 object-cover rounded"
                />

                <div className="flex flex-col">
                  <span className="text-sm font-medium line-clamp-1">
                    {book.title}
                  </span>
                  <span className="text-xs text-gray-500">
                    {book.author_name?.[0] || "Unknown author"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Books Display */}
      <div className="relative z-0">
        <BookList
          books={books}
          user={activeUser}
          onDelete={deleteBook}
        />
      </div>
    </div >
  );
}