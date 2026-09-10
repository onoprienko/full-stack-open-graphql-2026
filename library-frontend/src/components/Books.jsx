import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { BOOKS_BY_GENRE } from './../queries'

const Books = ({ show, books }) => {
  const [genre, setGenre] = useState(null)

  const booksResponse = useQuery(BOOKS_BY_GENRE, {
    variables: { genre: genre },
  })

  if (!show) return null
  if (!books) return 'no books'
  if (booksResponse.loading) return 'loading...'
  if (booksResponse.error) return `Error: ${booksResponse.error.message}`

  const genres = [
    ...books.reduce(
      (genresSet, b) => new Set([...genresSet, ...b.genres]),
      new Set(),
    ),
  ]

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
          {booksResponse.data.allBooks.map((book) => (
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
