export default function BookCard({ book, user, onDelete }) {
  return (
    <div className="p-3 border rounded-2xl shadow">
      {book.image && (
        <img
          src={book.image}
          className="h-40 w-full object-cover mb-2 rounded"
        />
      )}

      <h3 className="font-bold">{book.title}</h3>
      <p className="text-sm text-gray-600">{book.author}</p>

      <button
        onClick={() => onDelete(user, book.id)}
        className="mt-2 px-3 py-1 bg-red-500 text-white rounded"
      >
        Delete
      </button>
    </div>
  )
}