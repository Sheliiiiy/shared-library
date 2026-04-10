import BookCard from "./BookCard";

export default function BookList({ books, user, onDelete }) {
  const userBooks = books.filter((b) => b.user === user);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {userBooks.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}