const { GraphQLError } = require('graphql')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const jwt = require('jsonwebtoken')

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
    me: (root, args, context) => {
      return context.currentUser
    },
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        })
      }

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

      const savedBook = await book.save()
      try {
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

    editAuthor: async (root, args, { context }) => {
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        })
      }

      const author = await Author.findOne({ name: args.name })
      if (!author) return null
      author.born = args.setBornTo
      return author.save()
    },

    createUser: async (root, args) => {
      const user = new User({ ...args })
      return user.save().catch((error) => {
        throw new GraphQLError(`Creating the user failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error,
          },
        })
      })
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }
      const userForToken = {
        username: user.username,
        id: user._id,
      }
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  },
}

module.exports = resolvers
