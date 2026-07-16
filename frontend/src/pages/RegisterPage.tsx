import { useState } from 'react'
import { Link } from 'react-router-dom'
import FormInput from '../components/FormInput'
import { registerUser } from '../services/api'
import type { Standing, UserRegistration } from '../types'

const standingOptions: Standing[] = [
  'None',
  'Freshman',
  'Sophomore',
  'Junior',
  'Senior',
]

const initialForm: UserRegistration = {
  first_name: '',
  last_name: '',
  username: '',
  email: '',
  password: '',
  school: '',
  standing: 'None',
}

function RegisterPage() {
  const [formData, setFormData] = useState<UserRegistration>(initialForm)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function handleStandingChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setFormData((prev) => ({
      ...prev,
      standing: event.target.value as Standing,
    }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccessMessage('')

    try {
      await registerUser(formData)
      setSuccessMessage('Registration complete. You can now sign in.')
      setFormData(initialForm)
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h2 className="auth-card__title">Create your account</h2>
        <p className="auth-card__subtitle">
          Sign up to use course-specific AI study assistants.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-grid">
            <FormInput
              id="first_name"
              name="first_name"
              label="First name"
              value={formData.first_name}
              onChange={handleInputChange}
              required
            />
            <FormInput
              id="last_name"
              name="last_name"
              label="Last name"
              value={formData.last_name}
              onChange={handleInputChange}
              required
            />
          </div>

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
            id="email"
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            autoComplete="email"
          />
          <FormInput
            id="password"
            name="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            autoComplete="new-password"
          />
          <FormInput
            id="school"
            name="school"
            label="School (optional)"
            value={formData.school || ''}
            onChange={handleInputChange}
          />

          <div className="form-field">
            <label htmlFor="standing" className="form-field__label">
              Standing
            </label>
            <select
              id="standing"
              name="standing"
              className="form-field__control"
              value={formData.standing}
              onChange={handleStandingChange}
            >
              {standingOptions.map((standingOption) => (
                <option key={standingOption} value={standingOption}>
                  {standingOption}
                </option>
              ))}
            </select>
          </div>

          {error ? <p className="feedback feedback--error">{error}</p> : null}
          {successMessage ? (
            <p className="feedback feedback--success">{successMessage}</p>
          ) : null}

          <button type="submit" className="primary-button" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="auth-card__hint">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </section>
    </main>
  )
}

export default RegisterPage
