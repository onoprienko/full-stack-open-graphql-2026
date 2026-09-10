import { useState } from 'react'
import { useApolloClient, useMutation } from '@apollo/client/react'
import { LOGIN, ME } from '../queries'

const LoginForm = ({ setError, setToken, setPage, show }) => {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const client = useApolloClient()

  const [login] = useMutation(LOGIN, {
    onCompleted: async (data) => {
      const token = data.login.value
      localStorage.setItem('library-user-token', token)
      setToken(token)

      const { data: meData } = await client.query({
        query: ME,
        fetchPolicy: 'network-only',
      })

      client.writeQuery({
        query: ME,
        data: { me: meData.me },
      })

      setPage('authors')
    },
    onError: (error) => {
      setError(`login failed: ${error.message}`)
    },
  })

  const submit = (event) => {
    event.preventDefault()
    login({ variables: { name, password } })
  }

  if (!show) {
    return null
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          <label>
            username
            <input
              value={name}
              onChange={({ target }) => setName(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
