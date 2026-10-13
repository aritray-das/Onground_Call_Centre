import { useState, useEffect, useRef } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, PhoneCall } from 'lucide-react'
import './CallsToMake.css'
import { CALLS_TO_MAKE } from '../../data/mockData'
import { formatCurrency } from '../../utils/format'

const PAGE_SIZE = 5

/**
 * CallsToMake
 * 
 * Planner view for outgoing calls, displaying a ranked list of customers
 * prioritized by intent score. Supports expanding rows for more context 
 * and pagination for large lists.
 */
function CallsToMake() {
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedId, setExpandedId] = useState(null)
  const [demoAction, setDemoAction] = useState({})
  const timeoutsRef = useRef({})

  const handleStartCall = (phone) => {
    window.dispatchEvent(new CustomEvent('open-call-panel', { detail: { phone } }))
  }

  const handleAction = (callId, actionLabel) => {
    if (timeoutsRef.current[callId]) {
      clearTimeout(timeoutsRef.current[callId])
      delete timeoutsRef.current[callId]
    }

    setDemoAction((prev) => ({ ...prev, [callId]: actionLabel }))

    timeoutsRef.current[callId] = setTimeout(() => {
      setDemoAction((prev) => {
        const next = { ...prev }
        delete next[callId]
        return next
      })
      delete timeoutsRef.current[callId]
    }, 3000)
  }

  useEffect(() => {
    return () => {
      Object.values(timeoutsRef.current).forEach(clearTimeout)
      timeoutsRef.current = {}
    }
  }, [])

  const totalPages = Math.ceil(CALLS_TO_MAKE.length / PAGE_SIZE)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const currentCalls = CALLS_TO_MAKE.slice(startIndex, startIndex + PAGE_SIZE)

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    setExpandedId(null) // Reset expansion on page change
  }

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="planner">
      {/* ── Navy Band ────────────────────────────────────────────────────── */}
      <div className="planner-top-band">
        <span className="planner-top-band__caption">Planner</span>
        <span className="planner-top-band__title">Today's calling plan</span>
      </div>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="planner__header">
        <h1 className="planner__title">Planned outgoing calls</h1>
        <p className="planner__subtitle">Ranked by score — tap a lead to see the full picture</p>
      </div>

      {/* ── List Content ────────────────────────────────────────────────── */}
      <div className="planner__content">
        <div className="planner-list">
          {currentCalls.map((call) => {
            const isExpanded = expandedId === call.id
            return (
              <div 
                key={call.id} 
                className={`planner-card ${isExpanded ? 'planner-card--expanded' : ''}`}
              >
                {/* Main Row */}
                <button 
                  className="planner-card__main" 
                  onClick={() => toggleExpand(call.id)}
                  aria-expanded={isExpanded}
                >
                  <div className="planner-card__avatar" aria-hidden="true">
                    {call.initials}
                  </div>
                  
                  <div className="planner-card__info">
                    <div className="planner-card__name-row">
                      <span className="planner-card__name">{call.name}</span>
                      {call.isHot && <span className="planner-card__badge-hot">Hot</span>}
                    </div>
                    <div className="planner-card__product">
                      {call.product} &middot; {formatCurrency(call.value)}
                    </div>
                  </div>

                  <div className="planner-card__meta">
                    <div className="planner-card__time">{call.timeSlot}</div>
                    <div className="planner-card__score-badge" title={`Intent Score: ${call.score}`}>
                      {call.score}
                    </div>
                    <ChevronDown 
                      className={`planner-card__chevron ${isExpanded ? 'planner-card__chevron--expanded' : ''}`}
                      size={14}
                      aria-hidden="true"
                    />
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="planner-card__details">
                    <div className="planner-card__detail-row">
                      <span className="planner-card__detail-lbl">Context:</span>
                      <p className="planner-card__detail-val">{call.interest}</p>
                    </div>
                    <div className="planner-card__detail-row">
                      <span className="planner-card__detail-lbl">Status:</span>
                      <p className="planner-card__detail-val" style={{ textTransform: 'capitalize' }}>
                        {call.status}
                      </p>
                    </div>
                    
                    <div className="planner-card__actions">
                      {demoAction[call.id] ? (
                        <span className="planner-card__demo-msg" role="status" aria-live="polite">
                          {demoAction[call.id]}
                        </span>
                      ) : (
                        <>
                          <button 
                            type="button"
                            className="planner-btn planner-btn--primary"
                            onClick={() => handleStartCall(call.phone)}
                          >
                            <PhoneCall size={14} style={{ marginRight: 6 }} /> Start Call
                          </button>
                          <button 
                            type="button"
                            className="planner-btn planner-btn--secondary"
                            onClick={() => handleAction(call.id, 'Marked as skipped')}
                          >
                            Mark as Skipped
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* ── Pagination ────────────────────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="pagination__btn" 
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft size={14} style={{ marginRight: 4 }} /> Prev
            </button>
            <span className="pagination__info">Page {currentPage} of {totalPages}</span>
            <button 
              className="pagination__btn" 
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              aria-label="Next page"
            >
              Next <ChevronRight size={14} style={{ marginLeft: 4 }} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CallsToMake
