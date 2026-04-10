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

  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
    
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

    <button
      type="submit"
      className="h-[42px] bg-black text-white rounded px-4 hover:bg-gray-800"
    >
      Add
    </button>

  </div>
</form>
  );
}