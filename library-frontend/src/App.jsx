import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Recommendations from './components/Recommendations'

import { useApolloClient, useQuery } from '@apollo/client/react'
import { ALL_AUTHORS, ALL_BOOKS, ME } from './queries'
import Notify from './components/Notify'
import LoginForm from './components/LoginForm'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))
  const authorsResult = useQuery(ALL_AUTHORS)
  const booksResult = useQuery(ALL_BOOKS)
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  const client = useApolloClient()

  const [genreFilter, setGenreFilter] = useState(null)

  // TODO: after login currentUser does not updates
  const me = useQuery(ME, {
    skip: !token,
    fetchPolicy: 'no-cache',
  })
  const currentUser = me.data?.me

  if (authorsResult.loading || booksResult.loading) {
    return <div>loading...</div>
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const onLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>

        {!currentUser || !token ? (
          <button onClick={() => setPage('login')}>login</button>
        ) : (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommend')}>recommend</button>
            <button onClick={onLogout}>logout</button>
          </>
        )}
      </div>

      <Authors
        show={page === 'authors'}
        authors={authorsResult.data.allAuthors}
        setError={notify}
        token={token}
      />

      <Books
        show={page === 'books'}
        books={booksResult.data.allBooks}
        genreFilter={genreFilter}
        setGenreFilter={setGenreFilter}
      />

      <Notify errorMessage={errorMessage} />

      {!currentUser || !token ? (
        <>
          <LoginForm
            show={page === 'login'}
            setToken={setToken}
            setError={notify}
            setPage={setPage}
          />
        </>
      ) : (
        <>
          <Recommendations
            show={page === 'recommend'}
            books={booksResult.data.allBooks}
            favoriteGenre={me.data.me.favoriteGenre}
          />
          <NewBook
            show={page === 'add'}
            setError={notify}
            genreFilter={genreFilter}
          />
        </>
      )}
    </div>
  )
}

export default App
