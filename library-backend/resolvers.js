const { GraphQLError } = require('graphql')
const Author = require('./models/author')
const Book = require('./models/book')

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, { author, genre }) => {
      return Book.find({})
      // if (author && genre)
      //   return books.filter(
      //     (b) => b.author === author && b.genres.includes(genre),
      //   )
      // if (author) return books.filter((b) => b.author === author)
      // if (genre) return books.filter((b) => b.genres.includes(genre))
      // return books
    },
    allAuthors: async () => {
      return Author.find({})
      // return books.reduce((authorsAcc, book) => {
      //   const existingAuthor = authorsAcc.find((a) => a.name === book.author)
      //   if (existingAuthor) {
      //     existingAuthor.bookCount += 1
      //   } else {
      //     const authorDB = authors.find((a) => a.name === book.author)
      //     const author = { ...authorDB, bookCount: 1 }
      //     authorsAcc.push(author)
      //   }
      //   return authorsAcc
      // }, [])
    },
  },
  Mutation: {
    addBook: async (root, args) => {
      const authorExists = await Author.exists({ name: args.author })
      let author
      if (!authorExists) {
        author = new Author({ name: book.author })
      }

      // TODO: use author id in new book creation

      const bookExists = await Book.exists({ title: args.title })
      if (bookExists) {
        throw new GraphQLError(`Title must be unique: ${args.title}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
          },
        })
      }
      const book = new Book({ ...args })
      return book.save()
    },
    editAuthor: (root, args) => {
      // const author = authors.find((a) => a.name === args.name)
      // if (!author) {
      //   return null
      // }
      // const updatedAuthor = { ...author, born: args.setBornTo }
      // authors = authors.map((a) => (a.name === args.name ? updatedAuthor : a))
      // return updatedAuthor
    },
  },
}

module.exports = resolvers
