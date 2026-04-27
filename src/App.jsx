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
  updateBook as apiUpdateBook,
  addCollection as apiAddCollection,
  removeCollection as apiRemoveCollection,
  updateCollection as apiUpdateCollection,
} from "./api/client.js";

const USE_BACKEND = Boolean(import.meta.env.VITE_API_BASE);

export default function App() {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [collections, setCollections] = useState([]);
  const [activeCollection, setActiveCollection] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fromServer = useRef(false);

  const [activeUser, setActiveUserState] = useState(() => {
    const saved = getActiveUser();
    return saved || "";
  });

  const userBooks = books.filter((b) => b.user === activeUser);

  // Primary: Firebase direct (works everywhere). Optional: local backend in dev
  useEffect(() => {
    let cancelled = false;
    let unsub = null;
    let interval = null;

    async function init() {
      const normalizeBooks = (books) =>
        (books || []).map((b) => ({
          ...b,
          volumes: b.volumes ?? 1,
          volumesRead: b.volumesRead || Array(b.volumes ?? 1).fill(false),
        }));

      if (USE_BACKEND) {
        try {
          const data = await getLibrary();
          if (cancelled) return;
          setUsers(data.users || []);
          setBooks(normalizeBooks(data.books));
          setCollections(data.collections || []);
          setLoading(false);

          interval = setInterval(async () => {
            try {
              const d = await getLibrary();
              if (cancelled) return;
              setUsers(d.users || []);
              setBooks(normalizeBooks(d.books));
              setCollections(d.collections || []);
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
        setBooks((data.books || []).map((b) => ({
          ...b,
          volumes: b.volumes ?? 1,
          volumesRead: b.volumesRead || Array(b.volumes ?? 1).fill(false),
        })));
        setCollections(data.collections || []);
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
    updateLibrary({ users, books, collections }).catch((err) => {
      console.error("Failed to sync to Firebase:", err);
      setError("Failed to save changes. Check console for details.");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, books, collections]);

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

  const updateBook = async (updatedBook) => {
    if (USE_BACKEND) {
      try {
        const result = await apiUpdateBook(updatedBook);
        setBooks(result.books);
      } catch (err) {
        console.error("Failed to update book:", err);
        setError(err.message);
      }
    } else {
      setBooks((prev) =>
        prev.map((b) => (b.id === updatedBook.id ? updatedBook : b))
      );
    }
  };

  const addCollection = async (name) => {
    const newCollection = {
      id: crypto.randomUUID(),
      name: name.trim(),
      user: activeUser,
    };

    if (USE_BACKEND) {
      try {
        const result = await apiAddCollection(newCollection.name, newCollection.user);
        setCollections(result.collections);
      } catch (err) {
        console.error("Failed to add collection:", err);
        setError(err.message);
      }
    } else {
      setCollections((prev) => [...prev, newCollection]);
    }
  };

  const removeCollection = async (id) => {
    const confirmed = window.confirm("Delete this collection? Books will remain in your library.");
    if (!confirmed) return;

    if (USE_BACKEND) {
      try {
        const result = await apiRemoveCollection(id);
        setCollections(result.collections);
        setBooks(result.books);
        if (activeCollection === id) {
          setActiveCollection("all");
        }
      } catch (err) {
        console.error("Failed to remove collection:", err);
        setError(err.message);
      }
    } else {
      setCollections((prev) => prev.filter((c) => c.id !== id));
      setBooks((prev) => prev.map((b) => (b.collectionId === id ? { ...b, collectionId: null } : b)));
      if (activeCollection === id) {
        setActiveCollection("all");
      }
    }
  };

  const updateCollectionName = async (id, name) => {
    if (USE_BACKEND) {
      try {
        const result = await apiUpdateCollection(id, name);
        setCollections(result.collections);
      } catch (err) {
        console.error("Failed to update collection:", err);
        setError(err.message);
      }
    } else {
      setCollections((prev) =>
        prev.map((c) => (c.id === id ? { ...c, name: name.trim() } : c))
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[var(--text)]">Loading library...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Left background image */}
      <div
        className="fixed left-0 top-0 h-full bg-cover bg-center opacity-25 hidden lg:block"
        style={{
          width: 'max(0px, calc((100vw - 64rem) / 2))',
          backgroundImage: `url('https://images.stockcake.com/public/e/1/0/e10e5d46-ff9d-45ab-84fc-969d00b3b2c3/magical-library-interior-stockcake.jpg')`,
        }}
      />
      {/* Right background image */}
      <div
        className="fixed right-0 top-0 h-full bg-cover bg-center opacity-25 hidden lg:block"
        style={{
          width: 'max(0px, calc((100vw - 64rem) / 2))',
          backgroundImage: `url('https://images.stockcake.com/public/e/1/0/e10e5d46-ff9d-45ab-84fc-969d00b3b2c3/magical-library-interior-stockcake.jpg')`,
        }}
      />

      <div className="relative p-6 max-w-5xl mx-auto bg-[var(--bg)]">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2 animate-fade-in-up">
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
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

      {/* Stats bar */}
      <div className="mb-6 flex items-center gap-4 p-3 rounded-xl bg-[var(--code-bg)] border border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent-bg)] text-[var(--accent)] flex items-center justify-center">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-[var(--text)]">{activeUser}&apos;s collection</p>
            <p className="text-sm font-semibold text-[var(--text-h)]">
              {userBooks.length} {userBooks.length === 1 ? "book" : "books"}
            </p>
          </div>
        </div>
        <div className="h-8 w-px bg-[var(--border)]" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent-bg)] text-[var(--accent)] flex items-center justify-center">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-[var(--text)]">Total users</p>
            <p className="text-sm font-semibold text-[var(--text-h)]">{users.length}</p>
          </div>
        </div>
        <div className="h-8 w-px bg-[var(--border)]" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent-bg)] text-[var(--accent)] flex items-center justify-center">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-[var(--text)]">Total books</p>
            <p className="text-sm font-semibold text-[var(--text-h)]">{books.length}</p>
          </div>
        </div>
      </div>

      <BookSearch activeUser={activeUser} onAddBook={addBook} collections={collections} activeCollection={activeCollection} />

      <div className="my-6 border-t border-[var(--border)]" />

      <BookForm onAddBook={addBook} activeUser={activeUser} collections={collections} activeCollection={activeCollection} />

      <div className="my-6 border-t border-[var(--border)]" />

      <BookList
        books={books}
        user={activeUser}
        onDelete={deleteBook}
        onUpdateBook={updateBook}
        collections={collections}
        activeCollection={activeCollection}
        onSetActiveCollection={setActiveCollection}
        onAddCollection={addCollection}
        onRemoveCollection={removeCollection}
        onUpdateCollectionName={updateCollectionName}
      />
    </div>
    </>
  );
}

