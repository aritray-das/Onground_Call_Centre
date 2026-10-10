import { useState } from 'react'
import './Sidebar.css'

/**
 * NAV_ITEMS defines the full navigation tree.
 *
 * Each item has:
 *   id       — unique key used for active-state tracking
 *   label    — text shown in the sidebar
 *   children — optional array of sub-items (currently only "Plan" has these)
 *
 * This data lives here rather than in App so the sidebar is self-contained.
 * Move it to a separate data file if it grows large.
 */
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard' },
  {
    id: 'plan',
    label: 'Plan',
    children: [
      { id: 'plan-calls-to-make', label: 'Calls to make' },
      { id: 'plan-incoming',      label: 'Incoming' },
      { id: 'plan-recent',        label: 'Recent' },
      { id: 'plan-practise',      label: 'Practise a call' },
    ],
  },
  { id: 'calendar', label: 'Calendar' },
  { id: 'pulse',    label: 'Pulse' },
]

/**
 * Sidebar
 *
 * Props:
 *   activeId  — id string of the currently selected nav item
 *   onSelect  — callback(id: string) called when a nav item is clicked
 *
 * State (internal):
 *   planOpen  — whether the Plan sub-menu is expanded
 *
 * The sidebar does not own the selected state — AppShell does. This keeps
 * the sidebar "dumb" and easy to test or reuse.
 */
function Sidebar({ activeId, onSelect }) {
  // Track whether the Plan accordion is open.
  // Start open when a Plan child is already active.
  const planChildIds = NAV_ITEMS
    .find((item) => item.id === 'plan')
    .children.map((c) => c.id)

  const [planOpen, setPlanOpen] = useState(
    () => planChildIds.includes(activeId)
  )

  function handlePlanToggle() {
    setPlanOpen((prev) => !prev)
  }

  function handleItemClick(id) {
    onSelect(id)
  }

  return (
    <aside className="sidebar" aria-label="Main navigation">
      {/* ── Brand ──────────────────────────────────────────────── */}
      <div className="sidebar__brand">
        <div className="sidebar__brand-name">On-Ground.ai</div>
        <div className="sidebar__brand-sub">Call Centre</div>
      </div>

      {/* ── Navigation ─────────────────────────────────────────── */}
      <nav className="sidebar__nav">
        {NAV_ITEMS.map((item) => {
          const hasChildren = Boolean(item.children)
          const isParentActive =
            activeId === item.id ||
            (hasChildren && item.children.some((c) => c.id === activeId))

          if (hasChildren) {
            // ── Accordion parent (Plan) ────────────────────────
            return (
              <div key={item.id}>
                <button
                  type="button"
                  className={[
                    'nav-item',
                    isParentActive && !planOpen ? 'nav-item--active' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={handlePlanToggle}
                  aria-expanded={planOpen}
                >
                  {item.label}
                  <span
                    className={[
                      'nav-item__arrow',
                      planOpen ? 'nav-item__arrow--open' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    aria-hidden="true"
                  >
                    ›
                  </span>
                </button>

                {planOpen && (
                  <div className="nav-sublist" role="list">
                    {item.children.map((child) => (
                      <button
                        key={child.id}
                        type="button"
                        role="listitem"
                        className={[
                          'nav-subitem',
                          activeId === child.id ? 'nav-subitem--active' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        onClick={() => handleItemClick(child.id)}
                        aria-current={activeId === child.id ? 'page' : undefined}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          }

          // ── Flat item (Dashboard, Calendar, Pulse) ───────────
          return (
            <button
              key={item.id}
              type="button"
              className={[
                'nav-item',
                activeId === item.id ? 'nav-item--active' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => handleItemClick(item.id)}
              aria-current={activeId === item.id ? 'page' : undefined}
            >
              {item.label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
