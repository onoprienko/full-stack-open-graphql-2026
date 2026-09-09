const { GraphQLError } = require('graphql')
const Author = require('./models/author')
const Book = require('./models/book')

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, { author, genre }) => {
      if (author && genre) {
        const authorFromDB = await Author.findOne({ name: author })
        return Book.find({
          author: authorFromDB._id,
          genres: { $all: [genre] },
        }).populate('author')
      }
      if (author) {
        const authorFromDB = await Author.findOne({ name: author })
        console.log(authorFromDB)
        return await Book.find({
          author: authorFromDB._id,
        }).populate('author')
      }
      if (genre) {
        return Book.find({ genres: { $all: [genre] } }).populate('author')
      }
      return Book.find({}).populate('author')
    },
    allAuthors: async () => {
      const authors = await Author.find({})
      const books = await Book.find({}).populate('author')
      const authorsExtended = books.reduce((authorsAcc, book) => {
        const existingAuthor = authorsAcc.find(
          (a) => a.name === book.author.name,
        )
        if (existingAuthor) {
          existingAuthor.bookCount += 1
          existingAuthor.id = existingAuthor._id.toString()
        } else {
          const authorDB = authors.find((a) => a.name === book.author.name)
          const author = {
            ...authorDB._doc,
            bookCount: 1,
            id: authorDB._doc._id,
          }
          authorsAcc.push(author)
        }
        return authorsAcc
      }, [])
      return authorsExtended
    },
  },
  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.exists({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author })
        try {
          await author.save()
        } catch (error) {
          throw new GraphQLError(`Saving author failed: ${error.message}`, {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error,
            },
          })
        }
      }

      const bookExists = await Book.exists({ title: args.title })
      if (bookExists) {
        throw new GraphQLError(`Title must be unique: ${args.title}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
          },
        })
      }
      const book = new Book({ ...args, author: author._id.toString() })

      try {
        const savedBook = await book.save()
        await savedBook.populate('author')
      } catch (error) {
        throw new GraphQLError(`Saving book failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error,
          },
        })
      }
      return savedBook
    },

    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })
      if (!author) return null
      author.born = args.setBornTo
      return author.save()
    },
  },
}

module.exports = resolvers
