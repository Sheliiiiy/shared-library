import { useState } from "react"
import { addBook } from "../storage/books"

export default function AddBookForm({ onAdd }) {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [genre, setGenre] = useState("")
  const [image, setImage] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    const newBook = {
      id: crypto.randomUUID(),
      title,
      author,
      genre,
      image,
      user: "GG"
    }

    addBook(newBook)
    onAdd()

    setTitle("")
    setAuthor("")
    setGenre("")
    setImage("")
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Book</h2>

      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
      <input placeholder="Genre" value={genre} onChange={(e) => setGenre(e.target.value)} />
      <input placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} />

      <button type="submit">Add</button>
    </form>
  )
}