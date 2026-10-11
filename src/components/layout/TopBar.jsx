import './TopBar.css'

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
  avatarInitials: 'AR',
}

/**
 * TopBar
 *
 * A compact application bar rendered above the main content area.
 * It shows:
 *   - A small brand label (left)
 *   - Notification bell with a red badge count
 *   - Points and streak indicator (amber)
 *   - Circular avatar with initials (right)
 *
 * No props needed for this task — all values come from MOCK_TOPBAR_DATA.
 * When real data is introduced, pass these as props or read from context.
 */
function TopBar({ isMobileNavOpen = false, onToggleMobileNav }) {
  const { notificationCount, points, streak, avatarInitials } = MOCK_TOPBAR_DATA

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
          &#9776;
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
          <span className="topbar__bell" aria-hidden="true">🔔</span>
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
          <span className="topbar__points-icon" aria-hidden="true">⚡</span>
          <span className="topbar__points-value">{points.toLocaleString()}</span>
          <span className="topbar__points-label">pts</span>
          <span className="topbar__points-label" style={{ marginLeft: 2 }}>
            · {streak}d
          </span>
        </div>

        {/* Avatar */}
        <div
          className="topbar__avatar"
          aria-label={`User avatar for ${avatarInitials}`}
          title={avatarInitials}
        >
          {avatarInitials}
        </div>
      </div>
    </header>
  )
}

export default TopBar
