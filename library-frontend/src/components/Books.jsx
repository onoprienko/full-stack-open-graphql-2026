import { useState } from 'react'

const Books = ({ show, books }) => {
  const [genre, setGenre] = useState(null)

  if (!show) {
    return null
  }

  if (!books) return 'no books'

  const genres = [
    ...books.reduce(
      (genresSet, b) => new Set([...genresSet, ...b.genres]),
      new Set(),
    ),
  ]

  const filteredBooks = () => {
    if (!genre) return books
    return books.filter((b) => b.genres.includes(genre))
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks().map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>genres filter</h2>
      <div>
        {genres.map((genre) => (
          <button key={genre} onClick={() => setGenre(genre)}>
            {genre}
          </button>
        ))}
        <button key="all" onClick={() => setGenre(null)}>
          all genres
        </button>
      </div>
    </div>
  )
}

export default Books
