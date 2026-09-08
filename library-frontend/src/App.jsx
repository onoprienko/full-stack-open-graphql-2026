import { useState } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';

import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      bookCount
      born
      id
    }
  }
`;

const ALL_BOOKS = gql`
  query {
    allBooks {
      author
      published
      id
      title
    }
  }
`;

const App = () => {
  const authorsResult = useQuery(ALL_AUTHORS);
  const booksResult = useQuery(ALL_BOOKS);
  const [page, setPage] = useState('authors');

  if (authorsResult.loading || booksResult.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <Authors
        show={page === 'authors'}
        authors={authorsResult.data.allAuthors}
      />

      <Books show={page === 'books'} books={booksResult.data.allBooks} />

      <NewBook show={page === 'add'} />
    </div>
  );
};

export default App;
