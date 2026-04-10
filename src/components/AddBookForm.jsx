export default function BookForm({ onAddBook, activeUser }) {
  const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    const title = form.get("title");
    const author = form.get("author");
    const genre = form.get("genre");

    if (!title) return;

    onAddBook({
      id: crypto.randomUUID(),
      title,
      author: author || "Unknown",
      genre: genre || "Unknown",
      image: "",
      user: activeUser, // IMPORTANT in flat structure
    });

    e.target.reset();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 p-4 border rounded-lg shadow-sm"
    >
      <h2 className="text-lg font-semibold mb-3">
        ➕ Add Book Manually
      </h2>

      <div className="grid md:grid-cols-3 gap-3">
        <input
          name="title"
          className="border p-2 rounded"
          placeholder="Title"
        />

        <input
          name="author"
          className="border p-2 rounded"
          placeholder="Author"
        />

        <input
          name="genre"
          className="border p-2 rounded"
          placeholder="Genre"
        />
      </div>

      <button className="mt-3 px-4 py-2 bg-black text-white rounded">
        Add Book
      </button>
    </form>
  );
}