import { useState } from "react";
import BookCard from "./BookCard";

export default function BookList({
  books,
  user,
  onDelete,
  onUpdateBook,
  collections,
  activeCollection,
  onSetActiveCollection,
  onAddCollection,
  onRemoveCollection,
  onUpdateCollectionName,
}) {
  const [newCollectionName, setNewCollectionName] = useState("");
  const [editingCollection, setEditingCollection] = useState(null);
  const [editName, setEditName] = useState("");

  const userBooks = books.filter((b) => b.user === user);
  const userCollections = collections.filter((c) => c.user === user);

  const filteredBooks =
    activeCollection === "all"
      ? userBooks
      : userBooks.filter((b) => b.collectionId === activeCollection);

  const handleAddCollection = () => {
    const trimmed = newCollectionName.trim();
    if (!trimmed) return;
    onAddCollection(trimmed);
    setNewCollectionName("");
  };

  const handleStartEdit = (collection) => {
    setEditingCollection(collection.id);
    setEditName(collection.name);
  };

  const handleSaveEdit = (id) => {
    const trimmed = editName.trim();
    if (trimmed) {
      onUpdateCollectionName(id, trimmed);
    }
    setEditingCollection(null);
    setEditName("");
  };

  return (
    <div className="space-y-4">
      {/* Collection tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => onSetActiveCollection("all")}
          className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
            activeCollection === "all"
              ? "bg-[var(--accent)] text-white border-[var(--accent)]"
              : "bg-[var(--code-bg)] text-[var(--text)] border-[var(--border)] hover:bg-[var(--border)]"
          }`}
        >
          All
        </button>

        {userCollections.map((collection) => (
          <div key={collection.id} className="relative group flex items-center">
            {editingCollection === collection.id ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit(collection.id);
                    if (e.key === "Escape") {
                      setEditingCollection(null);
                      setEditName("");
                    }
                  }}
                  onBlur={() => handleSaveEdit(collection.id)}
                  autoFocus
                  className="px-2 py-1 rounded-full text-sm border border-[var(--accent)] bg-white dark:bg-[#1f2028] w-28"
                />
              </div>
            ) : (
              <button
                onClick={() => onSetActiveCollection(collection.id)}
                onDoubleClick={() => handleStartEdit(collection)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
                  activeCollection === collection.id
                    ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                    : "bg-[var(--code-bg)] text-[var(--text)] border-[var(--border)] hover:bg-[var(--border)]"
                }`}
              >
                {collection.name}
              </button>
            )}

            {editingCollection !== collection.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveCollection(collection.id);
                }}
                className="ml-1 p-0.5 rounded-full text-[var(--text)] opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition-all"
                title="Delete collection"
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            )}
          </div>
        ))}

        {/* Add collection input */}
        <div className="flex items-center gap-1">
          <input
            type="text"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddCollection();
            }}
            placeholder="New collection..."
            className="px-2 py-1 rounded-full text-sm border border-[var(--border)] bg-white dark:bg-[#1f2028] w-28 placeholder:text-gray-400"
          />
          <button
            onClick={handleAddCollection}
            className="p-1 rounded-full text-[var(--accent)] hover:bg-[var(--accent-bg)] transition-colors"
            title="Add collection"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-[var(--accent)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <h2 className="text-lg font-semibold text-[var(--text-h)]">My Books</h2>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-[var(--text)]">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--accent-bg)] text-[var(--accent)] text-xs font-bold">
            {filteredBooks.length}
          </span>
          <span>{filteredBooks.length === 1 ? "book" : "books"}</span>
        </div>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[var(--border)] rounded-2xl bg-[var(--code-bg)]">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-[var(--border)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            <path d="M12 7v6" />
            <path d="M9 10h6" />
          </svg>
          <h3 className="text-base font-medium text-[var(--text-h)] mb-1">No books yet</h3>
          <p className="text-sm text-[var(--text)] max-w-xs mx-auto">
            Search for books above or add one manually to start building your library.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onDelete={onDelete}
              onUpdateBook={onUpdateBook}
              collections={userCollections}
            />
          ))}
        </div>
      )}
    </div>
  );
}

