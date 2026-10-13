import { useState, useEffect, useRef } from 'react'
import { Menu, Bell, Zap, User, Settings, LogOut } from 'lucide-react'
import './TopBar.css'
import { AGENT } from '../../data/mockData'

/**
 * MOCK_TOPBAR_DATA — static display values.
 *
 * These are hard-coded sample values. They are not fetched from a backend.
 * In a later task, these can be lifted into props or a context.
 */
const MOCK_TOPBAR_DATA = {
  notificationCount: 3,
  points: 1240,
  streak: 7,           // days
}

/**
 * TopBar
 *
 * A compact application bar rendered above the main content area.
 * It shows:
 *   - A small brand label (left)
 *   - Notification bell with a red badge count
 *   - Points and streak indicator (amber)
 *   - Circular avatar with initials (right) which toggles a profile dropdown
 */
function TopBar({ isMobileNavOpen = false, onToggleMobileNav }) {
  const { notificationCount, points, streak } = MOCK_TOPBAR_DATA
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [demoMessage, setDemoMessage] = useState(null)
  const menuWrapperRef = useRef(null)
  const toastTimeoutRef = useRef(null)

  const handleItemClick = (label, message) => {
    setIsMenuOpen(false)
    setDemoMessage(message)

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current)
    }

    toastTimeoutRef.current = setTimeout(() => {
      setDemoMessage(null)
    }, 2500)
  }

  // Handle click outside and Escape key to close the dropdown
  useEffect(() => {
    if (!isMenuOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    const handleClickOutside = (e) => {
      if (menuWrapperRef.current && !menuWrapperRef.current.contains(e.target)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  // Clear toast timeout on unmount
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current)
      }
    }
  }, [])

  return (
    <header className="topbar" role="banner">
      {/* ── Left: mobile menu toggle & brand label ─────────────── */}
      <div className="topbar__left">
        <button
          type="button"
          className="topbar__menu-btn"
          onClick={onToggleMobileNav}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileNavOpen}
        >
          <Menu size={18} aria-hidden="true" />
        </button>
        <span className="topbar__brand">On-Ground.ai</span>
      </div>

      {/* ── Right: indicators ──────────────────────────────────── */}
      <div className="topbar__indicators">

        {/* Notification bell + red badge */}
        <div
          className="topbar__notification"
          title={`${notificationCount} notifications`}
        >
          <Bell className="topbar__bell" size={18} aria-hidden="true" />
          {notificationCount > 0 && (
            <span className="topbar__badge" aria-label={`${notificationCount} notifications`}>
              {notificationCount}
            </span>
          )}
        </div>

        {/* Points / streak pill */}
        <div
          className="topbar__points"
          title={`${points} points · ${streak}-day streak`}
        >
          <Zap className="topbar__points-icon" size={14} aria-hidden="true" />
          <span className="topbar__points-value">{points.toLocaleString()}</span>
          <span className="topbar__points-label">pts</span>
          <span className="topbar__points-label" style={{ marginLeft: 2 }}>
            · {streak}d
          </span>
        </div>

        {/* Profile Avatar Button & Dropdown */}
        <div className="topbar__profile-wrapper" ref={menuWrapperRef}>
          <button
            type="button"
            className="topbar__avatar"
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={`User profile menu for ${AGENT.name}`}
            title={AGENT.name}
          >
            {AGENT.initials}
          </button>

          {isMenuOpen && (
            <div className="topbar__dropdown" role="menu" aria-label="User profile menu">
              {/* Header */}
              <div className="topbar__dropdown-header">
                <div className="topbar__dropdown-avatar" aria-hidden="true">
                  {AGENT.initials}
                </div>
                <div className="topbar__dropdown-user">
                  <span className="topbar__dropdown-name">{AGENT.name}</span>
                  <span className="topbar__dropdown-sub">
                    {AGENT.location} &middot; {AGENT.role}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="topbar__dropdown-divider" role="separator" />

              {/* Menu items */}
              <div className="topbar__dropdown-menu">
                <button
                  type="button"
                  role="menuitem"
                  className="topbar__dropdown-item"
                  onClick={() => handleItemClick('Avatar', 'Demo: Avatar settings')}
                >
                  <User className="topbar__dropdown-item-icon" size={15} aria-hidden="true" />
                  <span>Avatar</span>
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="topbar__dropdown-item"
                  onClick={() => handleItemClick('Settings', 'Demo: Settings')}
                >
                  <Settings className="topbar__dropdown-item-icon" size={15} aria-hidden="true" />
                  <span>Settings</span>
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="topbar__dropdown-item topbar__dropdown-item--logout"
                  onClick={() => handleItemClick('Logout', 'Demo: Logged out')}
                >
                  <LogOut className="topbar__dropdown-item-icon" size={15} aria-hidden="true" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Demo Toast */}
      {demoMessage && (
        <div className="topbar__demo-toast" role="status" aria-live="polite">
          {demoMessage}
        </div>
      )}
    </header>
  )
}

export default TopBar

