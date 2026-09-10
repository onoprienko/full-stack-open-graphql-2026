import { useQuery } from '@apollo/client/react'
import { BOOKS_BY_GENRE } from './../queries'

const Books = ({ show, books, genreFilter, setGenreFilter }) => {
  const booksResponse = useQuery(BOOKS_BY_GENRE, {
    variables: { genre: genreFilter },
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

  const booksToRender = genreFilter ? booksResponse.data.allBooks : books

  return (
    <div>
      <h2>books</h2>
      {genreFilter ? <p>in genre {genreFilter} </p> : null}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToRender.map((book) => (
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
          <button key={genre} onClick={() => setGenreFilter(genre)}>
            {genre}
          </button>
        ))}
        <button key="all" onClick={() => setGenreFilter(null)}>
          all genres
        </button>
      </div>
    </div>
  )
}

export default Books
