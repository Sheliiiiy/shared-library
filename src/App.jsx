import { useState } from "react";

// Simple in-browser library app (can later connect to API)
export default function App() {
  const [users] = useState(["GG", "VK"]);
  const [activeUser, setActiveUser] = useState("GG");
  const [books, setBooks] = useState({
    GG: [],
    VK: []
  });

  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    image: ""
  });

  const addBook = () => {
    if (!form.title) return;
    setBooks({
      ...books,
      [activeUser]: [...books[activeUser], form]
    });
    setForm({ title: "", author: "", genre: "", image: "" });
  };

  const groupedBooks = books[activeUser].reduce((acc, book) => {
    if (!acc[book.genre]) acc[book.genre] = [];
    acc[book.genre].push(book);
    return acc;
  }, {});

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
      <div>
        {Object.keys(groupedBooks).map((genre) => (
          <div key={genre} className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{genre}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {groupedBooks[genre].map((book, i) => (
                <div key={i} className="p-3 border rounded-2xl shadow">
                  {book.image && (
                    <img src={book.image} alt={book.title} className="h-40 w-full object-cover mb-2 rounded" />
                  )}
                  <h3 className="font-bold">{book.title}</h3>
                  <p className="text-sm text-gray-600">{book.author}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}