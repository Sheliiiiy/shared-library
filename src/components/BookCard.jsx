import { useState } from "react";
import BookModal from "./BookModal";

export default function BookCard({ book, onDelete, onUpdateBook }) {
  const [imgError, setImgError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initials = book.title
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <>
      <div className="group relative p-4 rounded-2xl border border-[var(--border)] bg-white dark:bg-[#1f2028] card-hover flex gap-4 items-start animate-fade-in-up">
        {/* Cover */}
        <div>
          {book.image && !imgError ? (
            <img
              src={book.image}
              alt={book.title}
              className="h-32 w-24 object-cover rounded-lg shadow-sm flex-shrink-0 bg-gray-100"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <div
              className="h-32 w-24 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-lg font-bold shadow-sm"
              style={{
                background: `linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%)`,
              }}
            >
              {initials}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[var(--text-h)] leading-snug truncate">
            {book.title}
          </h3>
          <p className="text-sm text-[var(--text)] mt-0.5">{book.author}</p>

          <div className="mt-2">
            {book.genre && book.genre !== "Unknown" && (
              <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--accent-bg)] text-[var(--accent)] border border-[var(--accent-border)]">
                {book.genre}
              </span>
            )}
          </div>

          {/* Actions - appears on hover */}
          <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--accent)] bg-[var(--accent-bg)] hover:bg-[var(--accent-border)] border border-[var(--accent-border)]"
              title="View details"
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            </button>

            <button
              onClick={() => {
                const newImage = window.prompt("Enter new picture link:", book.image || "");
                if (newImage !== null) {
                  onUpdateBook({ ...book, image: newImage.trim() || undefined });
                  setImgError(false);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200"
              title="Edit picture link"
            >
              ✏️
            </button>

            <button
              onClick={() => onDelete(book.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200"
              title="Delete book"
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <BookModal book={book} onClose={() => setIsModalOpen(false)} onUpdateBook={onUpdateBook} />
      )}
    </>
  );
}
