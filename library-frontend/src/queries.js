import { gql } from '@apollo/client'

const AUTHOR_DETAILS = gql`
  fragment AuthorDetails on Author {
    id
    name
    born
  }
`

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      ...AuthorDetails
      bookCount
    }
  }
  ${AUTHOR_DETAILS}
`
export const ALL_BOOKS = gql`
  query {
    allBooks {
      author {
        ...AuthorDetails
      }
      published
      id
      title
      genres
    }
  }
  ${AUTHOR_DETAILS}
`

export const BOOKS_BY_GENRE = gql`
  query AllBooks($genre: String) {
    allBooks(genre: $genre) {
      author {
        ...AuthorDetails
      }
      id
      published
      title
      genres
    }
  }
  ${AUTHOR_DETAILS}
`

export const CREATE_BOOK = gql`
  mutation createPerson(
    $title: String!
    $published: Int!
    $author: String!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      published: $published
      author: $author
      genres: $genres
    ) {
      id
      title
      published
      author {
        ...AuthorDetails
      }
      genres
    }
  }
  ${AUTHOR_DETAILS}
`

export const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      ...AuthorDetails
    }
  }
  ${AUTHOR_DETAILS}
`

export const LOGIN = gql`
  mutation login($name: String!, $password: String!) {
    login(username: $name, password: $password) {
      value
    }
  }
`

export const ME = gql`
  query Me {
    me {
      favoriteGenre
      id
      username
    }
  }
`
