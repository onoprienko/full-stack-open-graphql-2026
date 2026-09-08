import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { EDIT_AUTHOR, ALL_AUTHORS } from './../queries'

const Authors = ({ show, authors, setError }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [changeBorn] = useMutation(EDIT_AUTHOR, {
    onError: (error) => setError(error.message),
    onCompleted: (data) => {
      if (!data.editAuthor) {
        setError('author not found')
      }
    },
  })

  if (!show) {
    return null
  }

  if (!authors) return 'no authors'

  const submit = async (event) => {
    event.preventDefault()
    changeBorn({ variables: { name, setBornTo: Number(born) } })
    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          <label>
            name
            <select
              value={name}
              onChange={({ target }) => setName(target.value)}
            >
              {authors.map((a) => (
                <option key={a.id} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            born
            <input
              type="number"
              value={born}
              onChange={({ target }) => setBorn(target.value)}
            />
          </label>
        </div>

        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors
