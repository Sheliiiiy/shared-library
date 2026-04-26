import BookCard from "./BookCard";

export default function BookList({ books, user, onDelete, onUpdateBook }) {
  const userBooks = books.filter((b) => b.user === user);

  return (
    <div className="space-y-4">
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
            {userBooks.length}
          </span>
          <span>{userBooks.length === 1 ? "book" : "books"}</span>
        </div>
      </div>

      {userBooks.length === 0 ? (
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
          {userBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onDelete={onDelete}
              onUpdateBook={onUpdateBook}
            />
          ))}
        </div>
      )}
    </div>
  );
}

