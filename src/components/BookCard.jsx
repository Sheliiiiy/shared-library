export default function BookCard({ book }) {
  return (
    <div className="p-3 border rounded-2xl shadow">
      {book.image && (
        <img
          src={book.image}
          alt={book.title}
          className="h-40 w-full object-cover mb-2 rounded"
        />
      )}
      <h3 className="font-bold">{book.title}</h3>
      <p className="text-sm text-gray-600">{book.author}</p>
    </div>
  )
}