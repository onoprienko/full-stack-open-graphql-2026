import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { LOGIN, ME } from '../queries'

const LoginForm = ({ setError, setToken, setPage, show }) => {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  const [login] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const token = data.login.value
      localStorage.setItem('library-user-token', token)
      setToken(token)
      setPage('authors')
    },
    refetchQueries: [{ query: ME }],
    onError: (error) => {
      setError(error.message)
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
          name{' '}
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          password{' '}
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
