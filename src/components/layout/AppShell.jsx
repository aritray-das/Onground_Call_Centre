import { useState } from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import './AppShell.css'
import Dashboard from '../dashboard/Dashboard'
import CallsToMake from '../plan/CallsToMake'
import Incoming from '../plan/Incoming'
import Recent from '../plan/Recent'
import Practise from '../plan/Practise'
import Calendar from '../calendar/Calendar'
import PulseHome from '../pulse/PulseHome'
import PulseChannel from '../pulse/PulseChannel'
import CallPanel from '../calling/CallPanel'

/**
 * AppShell
 *
 * The root layout component. It owns shared state for active navigation
 * and mobile sidebar drawer visibility.
 */
function AppShell() {
  // Start on Dashboard by default.
  const [activeId, setActiveId] = useState('dashboard')
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  const handleSelectNav = (id) => {
    setActiveId(id)
    setIsMobileNavOpen(false)
  }

  return (
    <div className="shell">
      {/* ── Mobile Backdrop ──────────────────────────────────── */}
      {isMobileNavOpen && (
        <div 
          className="shell__mobile-backdrop" 
          onClick={() => setIsMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar — left navigation column ─────────────────── */}
      <Sidebar 
        activeId={activeId} 
        onSelect={handleSelectNav} 
        isMobileNavOpen={isMobileNavOpen}
        onCloseMobileNav={() => setIsMobileNavOpen(false)}
      />

      {/* ── Right column: topbar + scrollable content ────────── */}
      <div className="shell__body">
        <TopBar 
          isMobileNavOpen={isMobileNavOpen}
          onToggleMobileNav={() => setIsMobileNavOpen((prev) => !prev)} 
        />

        <main className="shell__content" id="main-content">
          {activeId === 'dashboard' ? (
            <Dashboard onNavigate={handleSelectNav} />
          ) : activeId === 'plan-calls-to-make' ? (
            <CallsToMake />
          ) : activeId === 'plan-incoming' ? (
            <Incoming />
          ) : activeId === 'plan-recent' ? (
            <Recent />
          ) : activeId === 'plan-practise' ? (
            <Practise />
          ) : activeId === 'calendar' ? (
            <Calendar />
          ) : activeId === 'pulse' ? (
            <PulseHome onNavigate={handleSelectNav} />
          ) : activeId === 'pulse-channel' ? (
            <PulseChannel onNavigate={handleSelectNav} />
          ) : (
            <div className="content-placeholder">
              <h1 className="content-placeholder__heading">{activeId}</h1>
              <hr className="content-placeholder__divider" />
              <p className="content-placeholder__sub">Content for this section is coming soon.</p>
              <p className="content-placeholder__hint">
                Navigate using the sidebar to switch sections.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* ── Floating Voice Call Widget (WebRTC) ──────────────── */}
      <CallPanel />
    </div>
  )
}

export default AppShell
