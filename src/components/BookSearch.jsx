import { useEffect, useRef, useState } from "react";

export default function BookSearch({ onAddBook, activeUser }) {
    const timeoutRef = useRef(null);

    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);

    const searchBooks = async (value) => {
        if (!value) {
            setResults([]);
            return;
        }

        const res = await fetch(
            `https://openlibrary.org/search.json?q=${value}`
        );

        const data = await res.json();
        setResults(data.docs.slice(0, 6));
    };

    const handleSelect = (book) => {
        const newBook = {
            id: crypto.randomUUID(),
            title: book.title,
            author: book.author_name?.[0] || "Unknown",
            genre: book.subject?.[0] || "Unknown",
            image: book.cover_i
                ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                : "",
        };

        onAddBook(newBook);

        setSearch("");
        setResults([]);
    };

    return (
        <div className="relative mb-6">
            <h2 className="text-lg font-semibold mb-3">
                🔍 Search
            </h2>
            <input
                className="p-2 border rounded w-full"
                placeholder="Search books..."
                value={search}
                onChange={(e) => {
                    const value = e.target.value;
                    setSearch(value);

                    if (timeoutRef.current) clearTimeout(timeoutRef.current);

                    timeoutRef.current = setTimeout(() => {
                        searchBooks(value);
                    }, 400);
                }}
            />

            {results.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 z-[99999] bg-white border rounded shadow-lg max-h-80 overflow-auto">
                    {results.map((book, i) => (
                        <div
                            key={i}
                            className="p-2 hover:bg-gray-100 cursor-pointer flex gap-3 items-center"
                            onClick={() => handleSelect(book)}
                        >
                            <img
                                src={
                                    book.cover_i
                                        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`
                                        : ""
                                }
                                className="h-12 w-10 object-cover rounded"
                            />

                            <div className="flex flex-col">
                                <span className="text-sm font-medium line-clamp-1">
                                    {book.title}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {book.author_name?.[0] || "Unknown author"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}