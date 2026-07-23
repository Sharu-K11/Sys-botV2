import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { logoutUser } from '../services/api'
import ThemeToggle from './ThemeToggle'

interface NavbarProps {
  studentName?: string
  onLogout?: () => void
}

function Navbar({ studentName = 'Student', onLogout }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  function closeMenu() {
    setIsMenuOpen(false)
  }

  function handleLogout() {
    if (onLogout) {
      onLogout()
      return
    }

    logoutUser()
    navigate('/login')
  }

  const initials = studentName
    .split(' ')
    .map((name) => name.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)

  return (
    <header className="navbar" role="banner">
      <div className="navbar__inner">
        <div className="navbar__brand-block">
          <NavLink to="/dashboard" className="navbar__brand" onClick={closeMenu}>
            SysBot
          </NavLink>
          <span className="navbar__badge">AI Course Assistant</span>
        </div>

        <button
          type="button"
          className="navbar__menu-button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-expanded={isMenuOpen}
          aria-controls="sysbot-primary-nav"
          aria-label="Toggle navigation menu"
        >
          <span className="navbar__menu-line" />
          <span className="navbar__menu-line" />
          <span className="navbar__menu-line" />
        </button>

        <div className={`navbar__panel ${isMenuOpen ? 'navbar__panel--open' : ''}`}>
          <nav id="sysbot-primary-nav" className="navbar__nav" aria-label="Primary">
            <NavLink
              to="/dashboard"
              onClick={closeMenu}
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/agents"
              onClick={closeMenu}
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
            >
              Agents
            </NavLink>
            <NavLink
              to="/chat"
              onClick={closeMenu}
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
            >
              Chat
            </NavLink>
          </nav>

          <div className="navbar__actions">
            <ThemeToggle />
            <div className="navbar__profile" aria-label={`Logged in as ${studentName}`}>
              <span className="navbar__avatar" aria-hidden="true">
                {initials || 'S'}
              </span>
              <span className="navbar__student-name">{studentName}</span>
            </div>
            <button type="button" className="navbar__logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
