export default function BookForm({ onAddBook, activeUser, collections, activeCollection }) {
  const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    const title = form.get("title");
    const author = form.get("author");
    const genre = form.get("genre");
    const collectionId = form.get("collection");

    if (!title) return;

    onAddBook({
      id: crypto.randomUUID(),
      title,
      author: author || "Unknown",
      genre: genre || "Unknown",
      image: null,
      user: activeUser,
      volumes: 1,
      volumesRead: [false],
      collectionId: collectionId || null,
    });

    e.target.reset();
  };

  const userCollections = collections.filter((c) => c.user === activeUser);

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-5 rounded-xl border border-(--border) bg-(--code-bg)">
      <div className="mb-4">
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
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          <h2 className="text-lg font-semibold text-(--text-h)">Add Book Manually</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
        <div className="lg:col-span-2">
          <label className="block text-xs font-medium text-(--text-h) mb-1">Title</label>
          <input
            name="title"
            type="text"
            required
            className="w-full px-3 py-2.5 rounded-xl border border-(--border) bg-white text-sm placeholder:text-gray-400 input-focus"
            placeholder="e.g. The Great Gatsby"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-(--text-h) mb-1">Author</label>
          <input
            name="author"
            type="text"
            className="w-full px-3 py-2.5 rounded-xl border border-(--border) bg-white text-sm placeholder:text-gray-400 input-focus"
            placeholder="e.g. F. Scott Fitzgerald"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-(--text-h) mb-1">Genre</label>
          <input
            name="genre"
            type="text"
            className="w-full px-3 py-2.5 rounded-xl border border-(--border) bg-white text-sm placeholder:text-gray-400 input-focus"
            placeholder="e.g. Fiction"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-(--text-h) mb-1">Collection</label>
          <select
            name="collection"
            defaultValue={activeCollection === "all" ? "" : activeCollection}
            className="w-full px-3 py-2.5 rounded-xl border border-(--border) bg-white text-sm input-focus"
          >
            <option value="">No collection</option>
            {userCollections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="h-10.5 px-5 rounded-xl btn-primary text-sm font-medium flex items-center justify-center gap-2"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          Add Book
        </button>
      </div>
    </form>
  );
}

