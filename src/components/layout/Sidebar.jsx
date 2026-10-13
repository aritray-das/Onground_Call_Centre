import { useState } from 'react'
import {
  LayoutDashboard,
  PhoneCall,
  PhoneOutgoing,
  PhoneIncoming,
  Clock,
  Headphones,
  Calendar,
  Activity,
  ChevronRight,
} from 'lucide-react'
import './Sidebar.css'

/**
 * NAV_ITEMS defines the full navigation tree.
 */
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  {
    id: 'plan',
    label: 'Plan',
    icon: PhoneCall,
    children: [
      { id: 'plan-calls-to-make', label: 'Calls to make', icon: PhoneOutgoing },
      { id: 'plan-incoming',      label: 'Incoming',      icon: PhoneIncoming },
      { id: 'plan-recent',        label: 'Recent',        icon: Clock },
      { id: 'plan-practise',      label: 'Practise a call', icon: Headphones },
    ],
  },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'pulse',    label: 'Pulse',    icon: Activity },
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
function Sidebar({ activeId, onSelect, isMobileNavOpen = false, onCloseMobileNav }) {
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
    onCloseMobileNav?.()
  }

  return (
    <aside 
      className={`sidebar ${isMobileNavOpen ? 'sidebar--mobile-open' : ''}`} 
      aria-label="Main navigation"
    >
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
          const ItemIcon = item.icon

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
                  <span className="nav-item__left">
                    {ItemIcon && <ItemIcon className="nav-item__icon" size={16} aria-hidden="true" />}
                    <span>{item.label}</span>
                  </span>
                  <ChevronRight
                    className={[
                      'nav-item__arrow',
                      planOpen ? 'nav-item__arrow--open' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    size={14}
                    aria-hidden="true"
                  />
                </button>

                {planOpen && (
                  <div className="nav-sublist" role="list">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon
                      return (
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
                          <span className="nav-subitem__left">
                            {ChildIcon && <ChildIcon className="nav-subitem__icon" size={14} aria-hidden="true" />}
                            <span>{child.label}</span>
                          </span>
                        </button>
                      )
                    })}
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
              <span className="nav-item__left">
                {ItemIcon && <ItemIcon className="nav-item__icon" size={16} aria-hidden="true" />}
                <span>{item.label}</span>
              </span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
