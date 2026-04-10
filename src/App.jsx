import { useState, useEffect } from "react"
import BookList from "./components/BookList"

// Simple in-browser library app (can later connect to API)
export default function App() {
  const [users] = useState(["GG", "VK"]);
  const [activeUser, setActiveUser] = useState("GG");
  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem("books")
    return saved ? JSON.parse(saved) : { GG: [], VK: [] }
  });

  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books))
  }, [books])

  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    image: ""
  });

  const addBook = () => {
    if (!form.title.trim()) return;
    setBooks(prev => ({
      ...prev,
      [activeUser]: [
        ...prev[activeUser],
        {
          ...form,
          id: crypto.randomUUID()
        }
      ]
    }));
    setForm({ title: "", author: "", genre: "", image: "" });
  };

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

      {/* Add Book */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          placeholder="Author"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          placeholder="Genre"
          value={form.genre}
          onChange={(e) => setForm({ ...form, genre: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          placeholder="Image URL"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          className="p-2 border rounded"
        />
      </div>

      <button
        onClick={addBook}
        className="mb-6 px-4 py-2 bg-blue-500 text-white rounded-2xl shadow"
      >
        Add Book
      </button>

      {/* Books Display */}
      <BookList
        books={books}
        user={activeUser}
        onDelete={deleteBook}
      />
    </div>
  );
}