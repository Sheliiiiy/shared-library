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
import {
  getLibrary,
  addUser as apiAddUser,
  removeUser as apiRemoveUser,
  addBook as apiAddBook,
  removeBook as apiRemoveBook,
} from "./api/client.js";

const USE_BACKEND = Boolean(import.meta.env.VITE_API_BASE);

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

  // Primary: Firebase direct (works everywhere). Optional: local backend in dev
  useEffect(() => {
    let cancelled = false;
    let unsub = null;
    let interval = null;

    async function init() {
      if (USE_BACKEND) {
        try {
          const data = await getLibrary();
          if (cancelled) return;
          setUsers(data.users || []);
          setBooks(data.books || []);
          setLoading(false);

          interval = setInterval(async () => {
            try {
              const d = await getLibrary();
              if (cancelled) return;
              setUsers(d.users || []);
              setBooks(d.books || []);
            } catch (e) {
              console.error("Poll error:", e);
            }
          }, 2000);
          return;
        } catch (err) {
          console.warn("Backend unavailable, falling back to Firestore:", err.message);
        }
      }

      // Firestore direct (default for production / no backend)
      unsub = subscribeToLibrary((data) => {
        if (cancelled) return;
        fromServer.current = true;
        setUsers(data.users || []);
        setBooks(data.books || []);
        setLoading(false);
      });
    }

    init();

    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
      if (unsub) unsub();
    };
  }, []);

  // Sync local changes to Firestore (when not using backend)
  useEffect(() => {
    if (loading || USE_BACKEND) return;
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

  const addUser = async (name) => {
    if (activeUser !== "GG") return;

    if (USE_BACKEND) {
      try {
        const result = await apiAddUser(name);
        setUsers(result.users);
        if (!result.users.includes(activeUser)) {
          handleSetActiveUser(result.users[0]);
        }
      } catch (err) {
        console.error("Failed to add user:", err);
        setError(err.message);
      }
    } else {
      const next = storageAddUser(users, name);
      setUsers(next);
      if (!next.includes(activeUser)) {
        handleSetActiveUser(next[0]);
      }
    }
  };

  const removeUser = async (name) => {
    if (activeUser !== "GG") return;
    const confirmed = window.confirm(
      `Remove user "${name}" and all their books?`
    );
    if (!confirmed) return;

    if (USE_BACKEND) {
      try {
        const result = await apiRemoveUser(name);
        setUsers(result.users);
        setBooks(result.books);
        if (activeUser === name) {
          handleSetActiveUser(result.users[0]);
        }
      } catch (err) {
        console.error("Failed to remove user:", err);
        setError(err.message);
      }
    } else {
      const nextUsers = storageRemoveUser(users, name);
      setUsers(nextUsers);
      setBooks((prev) => removeBooksByUser(prev, name));
      if (activeUser === name) {
        handleSetActiveUser(nextUsers[0]);
      }
    }
  };

  const deleteBook = async (id) => {
    if (USE_BACKEND) {
      try {
        const result = await apiRemoveBook(id);
        setBooks(result.books);
      } catch (err) {
        console.error("Failed to delete book:", err);
        setError(err.message);
      }
    } else {
      setBooks((prev) => storageRemoveBook(prev, id));
    }
  };

  const addBook = async (book) => {
    const newBook = {
      ...book,
      user: activeUser,
      id: book.id || crypto.randomUUID(),
    };

    if (USE_BACKEND) {
      try {
        const result = await apiAddBook(newBook);
        setBooks(result.books);
      } catch (err) {
        console.error("Failed to add book:", err);
        setError(err.message);
      }
    } else {
      setBooks((prev) => storageAddBook(prev, newBook));
    }
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

