import './App.css'

/**
 * App — root component.
 *
 * For now this renders a simple starting screen so we can confirm the
 * Vite + React scaffold is healthy and the global CSS tokens are working.
 * In future tasks this component will be replaced with the full shell
 * layout (sidebar + topbar + main content area).
 */
function App() {
  return (
    <main className="start-screen">
      {/* Eyebrow label */}
      <span className="start-screen__eyebrow">On-Ground.ai</span>

      {/* Page heading — single h1 per page for SEO */}
      <h1 className="start-screen__heading">On-Ground.ai Call Centre</h1>

      {/* Short subtitle */}
      <p className="start-screen__subtitle">
        A professional call-centre workspace for managing agents, leads,
        scheduling, and real-time pulse tracking.
      </p>

      <hr className="start-screen__divider" />

      {/* Status indicator */}
      <span className="start-screen__badge">
        <span className="start-screen__dot" aria-hidden="true" />
        Foundation ready — awaiting next task
      </span>
    </main>
  )
}

export default App
