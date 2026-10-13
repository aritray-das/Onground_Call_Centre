import { useState, useEffect, useRef } from 'react'
import { CreditCard, Tag, ShieldCheck } from 'lucide-react'
import './LeadsModal.css'
import { LEADS } from '../../data/mockData'
import { formatCurrency } from '../../utils/format'

/**
 * LeadsModal
 * 
 * Interactive inspection modal for Hot Leads, accessible from the Dashboard.
 * Supports viewing lead qualifications, ICP match, lead intent score,
 * expandable signal breakdowns, and cycling through the leads pipeline.
 *
 * Props:
 *   isOpen: boolean - Whether the modal overlay is active
 *   onClose: function - Callback to dismiss the modal
 *   leads: Array - Optional array of leads; defaults to LEADS from mockData
 */
function LeadsModal({ isOpen, onClose, leads = LEADS.slice(0, 5) }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [expandedIcp, setExpandedIcp] = useState(true)
  const [expandedHistory, setExpandedHistory] = useState(true)
  const [expandedSignals, setExpandedSignals] = useState(true)

  const modalRef = useRef(null)
  const closeButtonRef = useRef(null)

  // Focus close button on mount/open
  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus()
    }
  }, [isOpen])

  // Escape key dismiss and body scroll lock
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose?.()
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => Math.max(0, prev - 1))
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => Math.min((leads?.length || 1) - 1, prev + 1))
      }
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose, leads])

  if (!isOpen) return null

  const safeLeads = Array.isArray(leads) && leads.length > 0 ? leads : []
  const currentLead = safeLeads[currentIndex] || null

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(safeLeads.length - 1, prev + 1))
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.()
    }
  }

  const getInterestText = (lead) => {
    if (!lead) return ''
    if (lead.product && typeof lead.value === 'number') {
      return `Interested: ${lead.product}, ${formatCurrency(lead.value)}`
    }
    if (lead.product) return `Interested: ${lead.product}`
    if (lead.interest) return lead.interest
    return null
  }

  return (
    <div 
      className="leads-modal-overlay" 
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div 
        className="leads-modal"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="leads-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Purple Header ────────────────────────────────────────────── */}
        <header className="leads-modal__header">
          <div className="leads-modal__header-left">
            <div className="leads-modal__header-title-row">
              <h2 id="leads-modal-title" className="leads-modal__title">Leads</h2>
              <span className="leads-modal__counter-badge" aria-label={`Lead ${currentIndex + 1} of ${safeLeads.length}`}>
                Lead {currentIndex + 1} of {safeLeads.length}
              </span>
              {currentLead?.timeRemaining && (
                <span className="leads-modal__countdown" title="Time remaining">
                  <span aria-hidden="true">⏱</span> {currentLead.timeRemaining} left
                </span>
              )}
            </div>
            {/* Progress dots row under the title */}
            <div className="leads-modal__dots" role="tablist" aria-label="Lead selection progress dots">
              {safeLeads.map((lead, idx) => (
                <button
                  key={lead.id || idx}
                  type="button"
                  role="tab"
                  aria-selected={idx === currentIndex}
                  className={`leads-modal__dot ${idx === currentIndex ? 'leads-modal__dot--active' : ''}`}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Lead ${idx + 1}`}
                />
              ))}
            </div>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="leads-modal__close-btn"
            onClick={onClose}
            aria-label="Close leads modal"
          >
            &times;
          </button>
        </header>

        {/* ── Modal Content Body ───────────────────────────────────────── */}
        <div className="leads-modal__body">
          {currentLead ? (
            <>
              {/* Profile Card */}
              <div className="leads-modal__profile">
                <div className="leads-modal__avatar" aria-hidden="true">
                  {currentLead.initials || currentLead.name?.slice(0, 2).toUpperCase() || 'LD'}
                </div>
                <div className="leads-modal__profile-content">
                  <div className="leads-modal__profile-header">
                    <h3 className="leads-modal__lead-name">{currentLead.name}</h3>
                    <span className={`leads-modal__status-tag leads-modal__status-tag--${currentLead.status || 'default'}`}>
                      {currentLead.status || 'Open'}
                    </span>
                  </div>

                  {getInterestText(currentLead) && (
                    <div className="leads-modal__interest-line">
                      {getInterestText(currentLead)}
                    </div>
                  )}

                  <div className="leads-modal__quote-strip">
                    Quote to be given to customer
                  </div>
                </div>
              </div>

              {/* Dual Scores Strip */}
              <div className="leads-modal__scores">
                {/* ICP Fit */}
                <div className="leads-modal__score-card">
                  <div className="leads-modal__score-header">
                    <span className="leads-modal__score-label">ICP Fit</span>
                    <span className="leads-modal__score-value">
                      {typeof currentLead.icpPercent === 'number' ? `${currentLead.icpPercent}%` : 'N/A'}
                    </span>
                  </div>
                  {typeof currentLead.icpPercent === 'number' ? (
                    <div className="leads-modal__score-meter" aria-hidden="true">
                      <div 
                        className="leads-modal__score-fill leads-modal__score-fill--purple" 
                        style={{ width: `${Math.min(100, Math.max(0, currentLead.icpPercent))}%` }}
                      />
                    </div>
                  ) : (
                    <div className="leads-modal__empty-state">Score not recorded</div>
                  )}
                </div>

                {/* Lead Intent */}
                <div className="leads-modal__score-card">
                  <div className="leads-modal__score-header">
                    <span className="leads-modal__score-label">Lead Intent</span>
                    <span className="leads-modal__score-value">
                      {typeof currentLead.intentScore === 'number' ? currentLead.intentScore : 'N/A'}
                    </span>
                  </div>
                  {typeof currentLead.intentScore === 'number' ? (
                    <div className="leads-modal__score-meter" aria-hidden="true">
                      <div 
                        className="leads-modal__score-fill leads-modal__score-fill--navy" 
                        style={{ width: `${Math.min(100, Math.max(0, currentLead.intentScore))}%` }}
                      />
                    </div>
                  ) : (
                    <div className="leads-modal__empty-state">Score not recorded</div>
                  )}
                </div>
              </div>

              {/* Accordions */}
              <div className="leads-modal__accordions">
                {/* 1. ICP FIT BREAKDOWN */}
                <div className={`leads-accordion ${expandedIcp ? 'leads-accordion--expanded' : ''}`}>
                  <button
                    type="button"
                    className="leads-accordion__trigger"
                    onClick={() => setExpandedIcp((prev) => !prev)}
                    aria-expanded={expandedIcp}
                    aria-controls="icp-breakdown-panel"
                  >
                    <span>ICP FIT BREAKDOWN</span>
                    <span className="leads-accordion__chevron" aria-hidden="true">&#9662;</span>
                  </button>
                  {expandedIcp && (
                    <div className="leads-accordion__panel" id="icp-breakdown-panel" role="region">
                      <p className="leads-accordion__desc">
                        {currentLead.icpBreakdown || 'Demographic and behavioral traits strongly match the ideal buyer profile for orthopaedic sleep systems.'}
                      </p>
                    </div>
                  )}
                </div>

                {/* 2. HOW WE GOT HERE */}
                <div className={`leads-accordion ${expandedHistory ? 'leads-accordion--expanded' : ''}`}>
                  <button
                    type="button"
                    className="leads-accordion__trigger"
                    onClick={() => setExpandedHistory((prev) => !prev)}
                    aria-expanded={expandedHistory}
                    aria-controls="how-we-got-here-panel"
                  >
                    <span>HOW WE GOT HERE</span>
                    <span className="leads-accordion__chevron" aria-hidden="true">&#9662;</span>
                  </button>
                  {expandedHistory && (
                    <div className="leads-accordion__panel" id="how-we-got-here-panel" role="region">
                      <p className="leads-accordion__desc">
                        {currentLead.howWeGotHere || currentLead.history || 'Inbound engagement on digital touchpoints followed by callback scheduling.'}
                      </p>
                    </div>
                  )}
                </div>

                {/* 3. WHERE WE PICKED UP SIGNALS */}
                <div className={`leads-accordion ${expandedSignals ? 'leads-accordion--expanded' : ''}`}>
                  <button
                    type="button"
                    className="leads-accordion__trigger"
                    onClick={() => setExpandedSignals((prev) => !prev)}
                    aria-expanded={expandedSignals}
                    aria-controls="signals-panel"
                  >
                    <span>WHERE WE PICKED UP SIGNALS</span>
                    <span className="leads-accordion__chevron" aria-hidden="true">&#9662;</span>
                  </button>
                  {expandedSignals && (
                    <div className="leads-accordion__panel" id="signals-panel" role="region">
                      <div className="leads-signals-blocks">
                        {/* Financing Related */}
                        <div className="leads-signal-block">
                          <div className="leads-signal-block__header">
                            <span className="leads-signal-block__icon" aria-hidden="true"><CreditCard size={15} /></span>
                            <span className="leads-signal-block__title">Financing Related</span>
                          </div>
                          <p className="leads-signal-block__desc">
                            <em>{currentLead.signals?.financing || 'Asked specifically about EMI options on the Ortho GRID — budget is a live concern, a blocker.'}</em>
                          </p>
                        </div>

                        {/* Quotation Demanded */}
                        <div className="leads-signal-block">
                          <div className="leads-signal-block__header">
                            <span className="leads-signal-block__icon" aria-hidden="true"><Tag size={15} /></span>
                            <span className="leads-signal-block__title">Quotation Demanded</span>
                          </div>
                          <p className="leads-signal-block__desc">
                            <em>{currentLead.signals?.quotation || 'Compared pricing with a competitor before reaching out — price-anchored, expects a competitive number.'}</em>
                          </p>
                        </div>

                        {/* Warranty Related */}
                        <div className="leads-signal-block">
                          <div className="leads-signal-block__header">
                            <span className="leads-signal-block__icon" aria-hidden="true"><ShieldCheck size={15} /></span>
                            <span className="leads-signal-block__title">Warranty Related</span>
                          </div>
                          <p className="leads-signal-block__desc">
                            <em>{currentLead.signals?.warranty || "Hasn't raised this yet — worth proactively mentioning the 100-night trial to reduce perceived risk."}</em>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="leads-modal__empty-state">
              <span className="leads-modal__empty-icon" aria-hidden="true">&#9432;</span>
              No lead record available.
            </div>
          )}
        </div>

        {/* ── Footer ──────────────────────────────────────────────────── */}
        <footer className="leads-modal__footer">
          <div className="leads-modal__missed-banner">
            <span className="leads-modal__missed-count-badge">
              {typeof currentLead?.missedCount === 'number' ? currentLead.missedCount : 2}
            </span>
            <span className="leads-modal__missed-text">
              Cumulative missed — expired without close, visible to manager
            </span>
          </div>

          <div className="leads-modal__nav-bar">
            <button
              type="button"
              className="leads-nav-btn"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              aria-label="Previous lead"
            >
              &larr; Previous
            </button>

            <span className="leads-modal__position-text" aria-live="polite">
              Lead {currentIndex + 1} of {safeLeads.length}
            </span>

            <button
              type="button"
              className="leads-nav-btn"
              onClick={handleNext}
              disabled={currentIndex === safeLeads.length - 1}
              aria-label="Next lead"
            >
              Next &rarr;
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default LeadsModal
