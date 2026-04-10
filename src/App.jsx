import { useEffect, useState } from "react";
import Header from "./components/Header";
import BookSearch from "./components/BookSearch";
import BookList from "./components/BookList";
import BookForm from "./components/AddBookForm";

export default function App() {
  const STORAGE_KEY = "book-library";

  const [users] = useState(["GG", "VK"]);
  const [activeUser, setActiveUser] = useState("GG");

  const [books, setBooks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }, [books]);

  const deleteBook = (id) => {
    setBooks((prev) => prev.filter((book) => book.id !== id));
  };

  const addBook = (book) => {
    setBooks((prev) => [
      ...prev,
      {
        ...book,
        user: activeUser,
        id: book.id || crypto.randomUUID(),
      },
    ]);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">

      <Header users={users} activeUser={activeUser} setActiveUser={setActiveUser} />

      <BookForm onAddBook={addBook} activeUser={activeUser} />

      <BookSearch activeUser={activeUser} onAddBook={addBook} />

      <BookList books={books} user={activeUser} onDelete={deleteBook} />

    </div>
  );
}