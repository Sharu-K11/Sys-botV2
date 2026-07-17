import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormInput from '../components/FormInput'
import { loginUser } from '../services/api'
import type { LoginRequest } from '../types'

const initialForm: LoginRequest = {
  username: '',
  password: '',
}

function LoginPage() {
  const [formData, setFormData] = useState<LoginRequest>(initialForm)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await loginUser(formData)
      navigate('/dashboard')
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h2 className="auth-card__title">Welcome back</h2>
        <p className="auth-card__subtitle">
          Log in and continue studying with your AI assistant.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <FormInput
            id="username"
            name="username"
            label="Username"
            value={formData.username}
            onChange={handleInputChange}
            required
            autoComplete="username"
          />
          <FormInput
            id="password"
            name="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            autoComplete="current-password"
          />

          {error ? <p className="feedback feedback--error">{error}</p> : null}

          <button type="submit" className="primary-button" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Log in'}
          </button>
        </form>

        <p className="auth-card__hint">
          Need an account? <Link to="/register">Create one</Link>
        </p>
      </section>
    </main>
  )
}

export default LoginPage
