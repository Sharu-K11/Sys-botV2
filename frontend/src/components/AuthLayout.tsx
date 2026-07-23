import type { ReactNode } from 'react'
import ThemeToggle from './ThemeToggle'

interface AuthLayoutProps {
  children: ReactNode
  eyebrow: string
  title: string
  description: string
}

function AuthLayout({ children, eyebrow, title, description }: AuthLayoutProps) {
  return (
    <main className="auth-page">
      <section className="auth-shell">
        <div className="auth-story">
          <div>
            <div className="auth-story__topbar">
              <span className="auth-story__brand">SysBot</span>
              <ThemeToggle />
            </div>
            <span className="auth-story__badge">AI Course Assistant</span>
          </div>
          <div className="auth-story__copy">
            <p className="auth-story__eyebrow">Your learning workspace</p>
            <h1>Build understanding, one question at a time.</h1>
            <p>
              Work through difficult concepts with focused AI tutors designed for
              different ways of learning.
            </p>
          </div>
          <div className="auth-story__preview" aria-hidden="true">
            <div className="auth-story__preview-head">
              <span>Today</span>
              <strong>Study plan</strong>
            </div>
            <div className="auth-story__lesson">
              <span>01</span>
              <div>
                <strong>Operating Systems</strong>
                <small>Memory management</small>
              </div>
              <b>42%</b>
            </div>
            <div className="auth-story__lesson">
              <span>02</span>
              <div>
                <strong>Database Systems</strong>
                <small>Normalization</small>
              </div>
              <b>68%</b>
            </div>
          </div>
        </div>

        <div className="auth-panel">
          <div className="auth-panel__heading">
            <p className="auth-panel__eyebrow">{eyebrow}</p>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
          {children}
        </div>
      </section>
    </main>
  )
}

export default AuthLayout