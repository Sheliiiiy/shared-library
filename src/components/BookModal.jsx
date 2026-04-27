import { useEffect } from "react";

export default function BookModal({ book, onClose, onUpdateBook, collections }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const initials = book.title
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const resizeVolumesRead = (current, newLength) => {
    const arr = current || [];
    if (arr.length === newLength) return arr;
    if (arr.length > newLength) return arr.slice(0, newLength);
    return [...arr, ...Array(newLength - arr.length).fill(false)];
  };

  const handleVolumesChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 100) {
      const nextVolumesRead = resizeVolumesRead(book.volumesRead, value);
      onUpdateBook({ ...book, volumes: value, volumesRead: nextVolumesRead });
    }
  };

  const handleToggleVolume = (index) => {
    const arr = book.volumesRead ? [...book.volumesRead] : [];
    arr[index] = !arr[index];
    onUpdateBook({ ...book, volumesRead: arr });
  };

  const handleCollectionChange = (e) => {
    const value = e.target.value;
    onUpdateBook({ ...book, collectionId: value || null });
  };

  const totalVolumes = book.volumes ?? 1;
  const showVolumeButtons = totalVolumes > 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md p-6 rounded-2xl border border-(--border) bg-white dark:bg-[#1f2028] shadow-2xl animate-modal-scale"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-(--text) hover:bg-(--code-bg) transition-colors"
          aria-label="Close"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <div className="flex flex-col items-center text-center">
          {book.image ? (
            <img
              src={book.image}
              alt={book.title}
              className="h-64 w-44 object-cover rounded-xl shadow-lg bg-gray-100 mb-5"
            />
          ) : (
            <div
              className="h-64 w-44 rounded-xl flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-5"
              style={{
                background: `linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%)`,
              }}
            >
              {initials}
            </div>
          )}

          <h2 className="text-xl font-semibold text-(--text-h) leading-snug mb-1">
            {book.title}
          </h2>
          <p className="text-base text-(--text) mb-3">{book.author}</p>

          {book.genre && book.genre !== "Unknown" && (
            <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-(--accent-bg) text-(--accent) border border-(--accent-border) mb-4">
              {book.genre}
            </span>
          )}

          <div className="w-full flex items-center justify-center gap-3 mt-2">
            <label className="text-sm font-medium text-(--text-h)">Collection</label>
            <select
              value={book.collectionId || ""}
              onChange={handleCollectionChange}
              className="px-3 py-2 rounded-xl border border-(--border) bg-white text-sm input-focus"
            >
              <option value="">No collection</option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full flex items-center justify-center gap-3 mt-3">
            <label className="text-sm font-medium text-(--text-h)">Volumes</label>
            <input
              type="number"
              min={1}
              max={100}
              value={totalVolumes}
              onChange={handleVolumesChange}
              className="w-20 px-3 py-2 rounded-xl border border-(--border) bg-white text-sm text-center input-focus"
            />
          </div>

          {showVolumeButtons && (
            <div className="w-full mt-4">
              <p className="text-xs text-(--text) mb-2">Click to mark as read</p>
              <div className="flex flex-wrap justify-center gap-2">
                {Array.from({ length: totalVolumes }, (_, i) => {
                  const isRead = book.volumesRead?.[i] || false;
                  return (
                    <button
                      key={i}
                      onClick={() => handleToggleVolume(i)}
                      title={isRead ? "Mark as unread" : "Mark as read"}
                      className={[
                        "w-9 h-9 rounded-lg text-sm font-semibold border transition-colors",
                        isRead
                          ? "bg-(--accent) text-white border-(--accent)"
                          : "bg-(--code-bg) text-(--text-h) border-(--border) hover:border-(--accent)",
                      ].join(" ")}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

