import React, { useState, useEffect, useRef } from 'react'
import './LeadsModal.css'
import { LEADS, EARNINGS } from '../../data/mockData'

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
  const [expandedIcp, setExpandedIcp] = useState(false)
  const [expandedHistory, setExpandedHistory] = useState(false)
  const [expandedSignals, setExpandedSignals] = useState(true)

  const modalRef = useRef(null)
  const closeButtonRef = useRef(null)

  // Focus close button and reset to first lead on mount/open
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0)
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

  const formatCurrency = (val) => {
    if (typeof val !== 'number') return '—'
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: EARNINGS?.currency || 'INR',
      maximumFractionDigits: 0
    }).format(val)
  }

  const getInterestText = (lead) => {
    if (!lead) return ''
    if (lead.company) {
      // Matches assignment brief example: "Interested: Ortho GRID"
      const cleanCompany = lead.company.replace(/\s+(Pvt\.?\s*Ltd\.?|LLC|Inc\.?)/i, '').trim()
      return `Interested: ${cleanCompany}`
    }
    if (lead.interest) return lead.interest
    if (lead.product) return `Interested: ${lead.product}`
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

                  <div className="leads-modal__product-meta">
                    {currentLead.product && <span>{currentLead.product}</span>}
                    {currentLead.product && typeof currentLead.value === 'number' && <span>&middot;</span>}
                    {typeof currentLead.value === 'number' && (
                      <span className="leads-modal__price">{formatCurrency(currentLead.value)}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quote / Summary Strip (if supported by lead data) */}
              {(currentLead.quote || currentLead.summary || currentLead.note) && (
                <div className="leads-modal__quote-strip">
                  <p>“{currentLead.quote || currentLead.summary || currentLead.note}”</p>
                </div>
              )}

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
                      {currentLead.icpBreakdown ? (
                        <div>{JSON.stringify(currentLead.icpBreakdown)}</div>
                      ) : (
                        <div className="leads-modal__empty-state">
                          <span className="leads-modal__empty-icon" aria-hidden="true">&#9432;</span>
                          No ICP fit breakdown details recorded for this lead.
                        </div>
                      )}
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
                      {currentLead.howWeGotHere || currentLead.history ? (
                        <div>{currentLead.howWeGotHere || currentLead.history}</div>
                      ) : (
                        <div className="leads-modal__empty-state">
                          <span className="leads-modal__empty-icon" aria-hidden="true">&#9432;</span>
                          No interaction history recorded for this lead.
                        </div>
                      )}
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
                      <div className="signals-list">
                        {/* Financing Related */}
                        <div className="signal-row">
                          <span className="signal-row__name">Financing Related</span>
                          <span className="signal-row__value">
                            {currentLead.signals?.financingRelated !== undefined || currentLead.signals?.financing !== undefined ? (
                              <span className="signal-badge signal-badge--active">
                                {String(currentLead.signals.financingRelated ?? currentLead.signals.financing)}
                              </span>
                            ) : (
                              <span className="signal-badge signal-badge--neutral">Not recorded</span>
                            )}
                          </span>
                        </div>

                        {/* Quotation Demanded (mapped to quotationDemanded or existing formFilled) */}
                        <div className="signal-row">
                          <span className="signal-row__name">Quotation Demanded</span>
                          <span className="signal-row__value">
                            {currentLead.signals?.quotationDemanded !== undefined || currentLead.signals?.quotation !== undefined ? (
                              <span className="signal-badge signal-badge--active">
                                {String(currentLead.signals.quotationDemanded ?? currentLead.signals.quotation)}
                              </span>
                            ) : typeof currentLead.signals?.formFilled === 'boolean' ? (
                              <span className={`signal-badge signal-badge--${currentLead.signals.formFilled ? 'active' : 'inactive'}`}>
                                {currentLead.signals.formFilled ? 'Yes (Form submitted)' : 'No'}
                              </span>
                            ) : (
                              <span className="signal-badge signal-badge--neutral">Not recorded</span>
                            )}
                          </span>
                        </div>

                        {/* Warranty Related */}
                        <div className="signal-row">
                          <span className="signal-row__name">Warranty Related</span>
                          <span className="signal-row__value">
                            {currentLead.signals?.warrantyRelated !== undefined || currentLead.signals?.warranty !== undefined ? (
                              <span className="signal-badge signal-badge--active">
                                {String(currentLead.signals.warrantyRelated ?? currentLead.signals.warranty)}
                              </span>
                            ) : (
                              <span className="signal-badge signal-badge--neutral">Not recorded</span>
                            )}
                          </span>
                        </div>

                        {/* Additional signals from current lead */}
                        {currentLead.signals ? (
                          <>
                            {typeof currentLead.signals.websiteVisits === 'number' && (
                              <div className="signal-row">
                                <span className="signal-row__name">Website Visits</span>
                                <span className="signal-row__value">
                                  <span className="signal-badge signal-badge--active">
                                    {currentLead.signals.websiteVisits} visits
                                  </span>
                                </span>
                              </div>
                            )}
                            {typeof currentLead.signals.emailOpens === 'number' && (
                              <div className="signal-row">
                                <span className="signal-row__name">Email Opens</span>
                                <span className="signal-row__value">
                                  <span className="signal-badge signal-badge--active">
                                    {currentLead.signals.emailOpens} opens
                                  </span>
                                </span>
                              </div>
                            )}
                            {typeof currentLead.signals.formFilled === 'boolean' && (
                              <div className="signal-row">
                                <span className="signal-row__name">Form Filled</span>
                                <span className="signal-row__value">
                                  <span className={`signal-badge signal-badge--${currentLead.signals.formFilled ? 'active' : 'inactive'}`}>
                                    {currentLead.signals.formFilled ? 'Yes' : 'No'}
                                  </span>
                                </span>
                              </div>
                            )}
                            {typeof currentLead.signals.callRequested === 'boolean' && (
                              <div className="signal-row">
                                <span className="signal-row__name">Call Requested</span>
                                <span className="signal-row__value">
                                  <span className={`signal-badge signal-badge--${currentLead.signals.callRequested ? 'active' : 'inactive'}`}>
                                    {currentLead.signals.callRequested ? 'Yes' : 'No'}
                                  </span>
                                </span>
                              </div>
                            )}
                            {typeof currentLead.signals.documentUploaded === 'boolean' && (
                              <div className="signal-row">
                                <span className="signal-row__name">Document Uploaded</span>
                                <span className="signal-row__value">
                                  <span className={`signal-badge signal-badge--${currentLead.signals.documentUploaded ? 'active' : 'inactive'}`}>
                                    {currentLead.signals.documentUploaded ? 'Yes' : 'No'}
                                  </span>
                                </span>
                              </div>
                            )}
                          </>
                        ) : null}
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
            {typeof currentLead?.missedCount === 'number' ? (
              <>
                <span className="leads-modal__missed-count-pill">{currentLead.missedCount}</span>
                <span>Cumulative missed / expired contact attempts</span>
              </>
            ) : (
              <span>No missed contact attempts recorded for this lead</span>
            )}
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
