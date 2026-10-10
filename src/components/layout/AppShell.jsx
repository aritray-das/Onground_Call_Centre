import { useState } from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import './AppShell.css'

/**
 * SECTION_META maps a nav item id to a human-readable heading and
 * a short description shown in the placeholder content area.
 *
 * When a real page component is ready for a section, replace the
 * placeholder JSX below with that component and remove its entry here.
 */
const SECTION_META = {
  'dashboard':        { heading: 'Dashboard',       desc: 'Your workspace overview will appear here.' },
  'plan-calls-to-make': { heading: 'Calls to make', desc: 'Your outbound call queue will appear here.' },
  'plan-incoming':    { heading: 'Incoming',         desc: 'Incoming call records will appear here.' },
  'plan-recent':      { heading: 'Recent',           desc: 'Recently completed calls will appear here.' },
  'plan-practise':    { heading: 'Practise a call',  desc: 'Call-practice simulator will appear here.' },
  'calendar':         { heading: 'Calendar',         desc: 'Your scheduling calendar will appear here.' },
  'pulse':            { heading: 'Pulse',            desc: 'Real-time pulse tracking will appear here.' },
}

/**
 * AppShell
 *
 * The root layout component. It owns the single piece of shared state:
 *   activeId — which navigation item is currently selected.
 *
 * It renders:
 *   <Sidebar>   — left column, receives activeId + onSelect callback
 *   <TopBar>    — fixed bar at the top of the right column
 *   placeholder — simple heading + description for the selected section
 *
 * When real page components are built, they replace the placeholder
 * inside shell__content, keyed on activeId.
 */
function AppShell() {
  // Start on Dashboard by default.
  const [activeId, setActiveId] = useState('dashboard')

  const section = SECTION_META[activeId] ?? {
    heading: activeId,
    desc: 'Content for this section is coming soon.',
  }

  return (
    <div className="shell">
      {/* ── Sidebar — left fixed column ──────────────────────── */}
      <Sidebar activeId={activeId} onSelect={setActiveId} />

      {/* ── Right column: topbar + scrollable content ────────── */}
      <div className="shell__body">
        <TopBar />

        <main className="shell__content" id="main-content">
          <div className="content-placeholder">
            <h1 className="content-placeholder__heading">{section.heading}</h1>
            <hr className="content-placeholder__divider" />
            <p className="content-placeholder__sub">{section.desc}</p>
            <p className="content-placeholder__hint">
              Navigate using the sidebar to switch sections.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AppShell
