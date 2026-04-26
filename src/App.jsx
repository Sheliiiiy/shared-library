import { useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import BookSearch from "./components/BookSearch";
import BookList from "./components/BookList";
import BookForm from "./components/AddBookForm";
import {
  addUser as storageAddUser,
  removeUser as storageRemoveUser,
  getActiveUser,
  setActiveUser,
} from "./storage/users.js";
import {
  addBook as storageAddBook,
  removeBook as storageRemoveBook,
  removeBooksByUser,
} from "./storage/books.js";
import { subscribeToLibrary, updateLibrary } from "./firebase/db.js";

export default function App() {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fromServer = useRef(false);

  const [activeUser, setActiveUserState] = useState(() => {
    const saved = getActiveUser();
    return saved || "";
  });

  // Subscribe to Firestore
  useEffect(() => {
    const unsub = subscribeToLibrary((data) => {
      fromServer.current = true;
      setUsers(data.users || []);
      setBooks(data.books || []);
      setLoading(false);
    });
    return unsub;
  }, []);

  // Sync to Firestore whenever users or books change
  // Only write when the change came from user action (not from snapshot)
  useEffect(() => {
    if (loading) return;
    if (fromServer.current) {
      fromServer.current = false;
      return;
    }
    updateLibrary({ users, books }).catch((err) => {
      console.error("Failed to sync to Firebase:", err);
      setError("Failed to save changes. Check console for details.");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, books]);

  const handleSetActiveUser = (user) => {
    setActiveUserState(user);
    setActiveUser(user);
  };

  const addUser = (name) => {
    if (activeUser !== "GG") return;
    const next = storageAddUser(users, name);
    setUsers(next);
    if (!next.includes(activeUser)) {
      handleSetActiveUser(next[0]);
    }
  };

  const removeUser = (name) => {
    if (activeUser !== "GG") return;
    const confirmed = window.confirm(
      `Remove user "${name}" and all their books?`
    );
    if (!confirmed) return;

    const nextUsers = storageRemoveUser(users, name);
    setUsers(nextUsers);

    // Remove books belonging to deleted user
    setBooks((prev) => removeBooksByUser(prev, name));

    if (activeUser === name) {
      handleSetActiveUser(nextUsers[0]);
    }
  };

  const deleteBook = (id) => {
    setBooks((prev) => storageRemoveBook(prev, id));
  };

  const addBook = (book) => {
    setBooks((prev) =>
      storageAddBook(prev, {
        ...book,
        user: activeUser,
        id: book.id || crypto.randomUUID(),
      })
    );
  };

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto flex items-center justify-center min-h-50">
        <p className="text-gray-500">Loading library...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
      <Header
        users={users}
        activeUser={activeUser}
        setActiveUser={handleSetActiveUser}
        onAddUser={addUser}
        onRemoveUser={removeUser}
      />

      <BookForm onAddBook={addBook} activeUser={activeUser} />

      <BookSearch activeUser={activeUser} onAddBook={addBook} />

      <BookList books={books} user={activeUser} onDelete={deleteBook} />
    </div>
  );
}

