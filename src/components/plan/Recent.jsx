import { useState } from 'react'
import { PhoneCall } from 'lucide-react'
import './Recent.css'
import { RECENT_CALLS } from '../../data/mockData'

/**
 * Recent
 * 
 * Planner view for completed or missed recent calls. Displays history
 * and provides an expandable review section per call.
 */
function Recent() {
  const [selectedId, setSelectedId] = useState(null)

  const handleCall = (phone) => {
    window.dispatchEvent(new CustomEvent('open-call-panel', { detail: { phone } }))
  }

  const toggleSelect = (id) => {
    setSelectedId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="recent-view">
      {/* ── Navy Band ────────────────────────────────────────────────────── */}
      <div className="planner-top-band">
        <span className="planner-top-band__caption">Planner</span>
        <span className="planner-top-band__title">Today's calling plan</span>
      </div>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="recent-header">
        <h1 className="recent-header__title">Recent calls</h1>
        <p className="recent-header__subtitle">Tap a call to review it</p>
      </div>

      {/* ── List Content ────────────────────────────────────────────────── */}
      <div className="recent-content">
        <div className="recent-list">
          {RECENT_CALLS.map((call) => {
            const isSelected = selectedId === call.id
            const isConverted = call.outcome === 'converted'

            return (
              <div 
                key={call.id} 
                className={`recent-card ${isSelected ? 'recent-card--expanded' : ''}`}
              >
                {/* Main Row */}
                <button 
                  className="recent-card__main" 
                  onClick={() => toggleSelect(call.id)}
                  aria-expanded={isSelected}
                >
                  <div 
                    className={`recent-card__avatar ${isConverted ? 'recent-card__avatar--converted' : ''}`} 
                    aria-hidden="true"
                  >
                    {call.initials}
                  </div>
                  
                  <div className="recent-card__info">
                    <div className="recent-card__name-row">
                      <span className="recent-card__name">{call.callerName}</span>
                      <span className={`recent-card__type recent-card__type--${call.callType}`}>
                        {call.callType}
                      </span>
                    </div>
                    <div className="recent-card__details-summary">
                      {call.outcomeLabel}
                    </div>
                  </div>

                  <div className="recent-card__meta">
                    <div className="recent-card__time">{call.dateTimeLabel}</div>
                    <div className="recent-card__duration">
                      Duration: {call.duration}
                    </div>
                  </div>
                </button>

                {/* Expanded Review Panel */}
                {isSelected && (
                  <div className="recent-card__review">
                    <div className="recent-card__review-header">
                      <span className="recent-card__review-title">Call Review</span>
                    </div>
                    
                    <div className="recent-card__review-section">
                      <span className="recent-card__review-lbl">Context & Outcome</span>
                      <p className="recent-card__review-val">{call.context}</p>
                    </div>

                    <div className="recent-card__review-demo">
                      No additional review details (like transcripts or recordings) are available in this demo.
                    </div>

                    <div className="recent-card__actions">
                      <button 
                        type="button"
                        className="recent-btn recent-btn--call"
                        onClick={() => handleCall(call.phone)}
                        aria-label={`Call ${call.callerName}`}
                      >
                        <PhoneCall size={14} style={{ marginRight: 6 }} /> Call
                      </button>
                      <button 
                        type="button"
                        className="recent-card__close-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedId(null)
                        }}
                      >
                        Close Review
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Recent
