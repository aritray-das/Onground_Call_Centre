import React, { useState, useEffect, useRef } from 'react'
import './Incoming.css'
import { INCOMING_SUMMARY, INCOMING_CALLS } from '../../data/mockData'

/**
 * Incoming
 * 
 * Planner view for incoming (missed) calls. Displays a summary and a list
 * of missed calls that may require follow-up. Includes a demo callback action.
 */
function Incoming() {
  const [demoMessageId, setDemoMessageId] = useState(null)
  const timeoutRef = useRef(null)

  const handleCallback = (id) => {
    setDemoMessageId(id)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    
    timeoutRef.current = setTimeout(() => {
      setDemoMessageId(null)
    }, 3000)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: INCOMING_SUMMARY.currency,
      maximumFractionDigits: 0
    }).format(val)
  }

  return (
    <div className="incoming-view">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="incoming-header">
        <div>
          <h1 className="incoming-header__title">Incoming calls</h1>
          <p className="incoming-header__subtitle">Missed calls that may require follow-up.</p>
        </div>
        
        <div className="incoming-summary">
          <div className="incoming-summary__item">
            <span className="incoming-summary__val">{INCOMING_SUMMARY.missedToday}</span>
            <span className="incoming-summary__lbl">missed today</span>
          </div>
          <div className="incoming-summary__item">
            <span className="incoming-summary__val">
              {formatCurrency(INCOMING_SUMMARY.expectedValue)}
            </span>
            <span className="incoming-summary__lbl">expected value</span>
          </div>
        </div>
      </div>

      {/* ── List Content ────────────────────────────────────────────────── */}
      <div className="incoming-content">
        <div className="incoming-list">
          {INCOMING_CALLS.map((call) => (
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
                {call.expectedValue > 0 && (
                  <div className="incoming-card__value">
                    Expected Value: {formatCurrency(call.expectedValue)}
                  </div>
                )}
              </div>

              <div className="incoming-card__actions">
                {demoMessageId === call.id ? (
                  <span className="incoming-card__demo-msg" role="status" aria-live="polite">
                    Demo: No call placed
                  </span>
                ) : (
                  <button 
                    className="incoming-btn"
                    onClick={() => handleCallback(call.id)}
                    aria-label={`Call back ${call.callerName}`}
                  >
                    Call back
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Incoming
