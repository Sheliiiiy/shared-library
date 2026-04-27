import { useEffect, useRef, useState } from "react";

export default function BookSearch({ onAddBook, activeUser, collections, activeCollection }) {
  const timeoutRef = useRef(null);
  const containerRef = useRef(null);

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(activeCollection === "all" ? "" : activeCollection);

  const userCollections = collections.filter((c) => c.user === activeUser);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchBooks = async (value) => {
    if (!value.trim()) {
      setResults([]);
      setLoading(false);
      setOpen(false);
      return;
    }

    setLoading(true);
    setOpen(true);

    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(value)}`
      );

      if (!res.ok) {
        console.warn(`OpenLibrary API error: ${res.status}`);
        setResults([]);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setResults((data.docs || []).slice(0, 6));
    } catch (err) {
      console.error("Book search failed:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (book) => {
    const newBook = {
      id: crypto.randomUUID(),
      title: book.title,
      author: book.author_name?.[0] || "Unknown",
      genre: book.subject?.[0] || "Unknown",
      image: book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : null,
      volumes: 1,
      volumesRead: [false],
      collectionId: selectedCollection || null,
    };

    onAddBook(newBook);

    setSearch("");
    setResults([]);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative mb-8">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 mb-1">
          <svg
            className="w-5 h-5 text-(--accent)"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <h2 className="text-lg font-semibold text-(--text-h)">Discover Books</h2>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-(--text)">Add to:</label>
          <select
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
            className="px-2 py-1 rounded-lg border border-(--border) bg-white text-xs input-focus"
          >
            <option value="">No collection</option>
            {userCollections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-(--border) bg-white text-sm placeholder:text-gray-400 input-focus"
          placeholder="Search by title, author, or ISBN..."
          value={search}
          onChange={(e) => {
            const value = e.target.value;
            setSearch(value);

            if (timeoutRef.current) clearTimeout(timeoutRef.current);

            timeoutRef.current = setTimeout(() => {
              searchBooks(value);
            }, 350);
          }}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-(--accent) border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-white dark:bg-[#1f2028] border border-(--border) rounded-xl shadow-lg max-h-80 overflow-auto">
          {results.length === 0 && !loading ? (
            <div className="p-6 text-center text-sm text-gray-500">
              <svg
                className="w-10 h-10 mx-auto mb-2 text-gray-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              No results found
            </div>
          ) : (
            results.map((book, i) => (
              <div
                key={i}
                className="p-3 hover:bg-(--accent-bg) cursor-pointer flex gap-3 items-center transition-colors border-b border-(--border) last:border-b-0"
                onClick={() => handleSelect(book)}
              >
                {book.cover_i ? (
                  <img
                    src={`https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`}
                    alt={book.title}
                    className="h-14 w-11 object-cover rounded-md shrink-0 bg-gray-100"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-14 w-11 bg-(--code-bg) rounded-md shrink-0 flex items-center justify-center text-xs font-bold text-(--text-h)">
                    {book.title?.slice(0, 1).toUpperCase() || "?"}
                  </div>
                )}

                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-(--text-h) truncate">
                    {book.title}
                  </span>
                  <span className="text-xs text-(--text)">
                    {book.author_name?.[0] || "Unknown author"}
                  </span>
                  {book.first_publish_year && (
                    <span className="text-xs text-gray-400">
                      {book.first_publish_year}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

