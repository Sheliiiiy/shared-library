import { useEffect, useState } from "react";
import Header from "./components/Header";
import BookSearch from "./components/BookSearch";
import BookList from "./components/BookList";

export default function App() {
  const [users] = useState(["GG", "VK"]);
  const [activeUser, setActiveUser] = useState("GG");

  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem("books");
    if (!saved) return { GG: [], VK: [] };

    const parsed = JSON.parse(saved);

    for (const user of ["GG", "VK"]) {
      parsed[user] = parsed[user].map((book) => ({
        ...book,
        id: book.id || crypto.randomUUID(),
      }));
    }

    return parsed;
  });

  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books));
  }, [books]);

  const deleteBook = (user, id) => {
    setBooks((prev) => ({
      ...prev,
      [user]: prev[user].filter((book) => book.id !== id),
    }));
  };

  const addBook = (book) => {
    setBooks((prev) => ({
      ...prev,
      [activeUser]: [...prev[activeUser], book],
    }));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* HEADER */}
      <Header users={users} activeUser={activeUser} setActiveUser={setActiveUser}/>

      {/* SEARCH */}
      <BookSearch activeUser={activeUser} onAddBook={addBook} />

      {/* LIST */}
      <BookList books={books} user={activeUser} onDelete={deleteBook} />
    </div>
  );
}