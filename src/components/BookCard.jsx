export default function BookCard({ book, onDelete }) {
  return (
    <div className="p-3 border rounded-2xl shadow flex gap-4 items-start h-full">

      {book.image && (
        <img
          src={book.image}
          className="h-24 w-20 object-cover rounded flex-shrink-0"
        />
      )}

      <div className="flex-1 flex flex-col">
        <h3 className="font-bold">{book.title}</h3>
        <p className="text-sm text-gray-600">{book.author}</p>

        <div className="mt-auto">
          <button
            onClick={() => onDelete(book.id)}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}