import './Incoming.css'
import { INCOMING_SUMMARY, INCOMING_CALLS } from '../../data/mockData'
import { formatCurrency } from '../../utils/format'

/**
 * Incoming
 * 
 * Planner view for incoming (missed) calls, ranked by expected value.
 */
function Incoming() {
  const handleCallback = (phone) => {
    window.dispatchEvent(new CustomEvent('open-call-panel', { detail: { phone } }))
  }

  // Sort rows by expected value, highest first
  const sortedCalls = [...INCOMING_CALLS].sort((a, b) => b.expectedValue - a.expectedValue)

  return (
    <div className="incoming-view">
      {/* ── Navy Band ────────────────────────────────────────────────────── */}
      <div className="planner-top-band">
        <span className="planner-top-band__caption">Planner</span>
        <span className="planner-top-band__title">Today's calling plan</span>
      </div>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="incoming-header">
        <h1 className="incoming-header__title">Missed calls</h1>
        <p className="incoming-header__subtitle">
          Ranked by expected value, so the highest-value leads come first
        </p>
      </div>

      {/* ── Light Summary Strip ─────────────────────────────────────────── */}
      <div className="incoming-summary-strip">
        <span className="incoming-summary-strip__item">
          <strong>{INCOMING_SUMMARY.missedToday}</strong> MISSED TODAY
        </span>
        <span className="incoming-summary-strip__divider" aria-hidden="true">&middot;</span>
        <span className="incoming-summary-strip__item">
          <strong>{formatCurrency(INCOMING_SUMMARY.expectedValue)}</strong> EXPECTED VALUE AT STAKE
        </span>
      </div>

      {/* ── List Content ────────────────────────────────────────────────── */}
      <div className="incoming-content">
        <div className="incoming-list">
          {sortedCalls.map((call) => (
            <div key={call.id} className="incoming-card">
              <div className="incoming-card__avatar" aria-hidden="true">
                {call.initials}
              </div>
              
              <div className="incoming-card__info">
                <div className="incoming-card__name-row">
                  <span className="incoming-card__name">{call.callerName}</span>
                  <span className="incoming-card__time">Missed: {call.time}</span>
                </div>
                <p className="incoming-card__context">{call.context}</p>
              </div>

              <div className="incoming-card__actions">
                <span className="incoming-card__expected-val">
                  {formatCurrency(call.expectedValue)} expected
                </span>
                <button 
                  type="button"
                  className="incoming-btn incoming-btn--green"
                  onClick={() => handleCallback(call.phone)}
                  aria-label={`Call back ${call.callerName}`}
                >
                  Call back
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Incoming
