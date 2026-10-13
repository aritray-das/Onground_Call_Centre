import { useState, useEffect } from 'react'
import './CallPanel.css'
import { useTwilioCall } from '../../hooks/useTwilioCall'

/**
 * CallPanel
 * 
 * Floating in-app voice call widget powered by @twilio/voice-sdk.
 * Placed globally in AppShell to provide phone dialing to test phones.
 */
function CallPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [prevStatus, setPrevStatus] = useState('idle')
  const [phoneNumber, setPhoneNumber] = useState('')

  const {
    status,
    errorMessage,
    startCall,
    hangUp,
    toggleMute,
    isMuted,
    callSeconds,
    passcode,
    setPasscode,
  } = useTwilioCall()

  // Automatically open panel when call becomes active (connecting, ringing, in-call)
  if (status !== prevStatus) {
    setPrevStatus(status)
    if (status === 'connecting' || status === 'ringing' || status === 'in-call') {
      setIsOpen(true)
    }
  }

  // Listen for global custom event 'open-call-panel' (e.g. from Incoming, CallsToMake, Recent)
  useEffect(() => {
    const handleGlobalOpen = (e) => {
      setIsOpen(true)
      if (e.detail?.phone) {
        setPhoneNumber(e.detail.phone)
      }
    }
    window.addEventListener('open-call-panel', handleGlobalOpen)
    return () => {
      window.removeEventListener('open-call-panel', handleGlobalOpen)
    }
  }, [])

  const handlePasscodeChange = (e) => {
    const val = e.target.value
    setPasscode(val)
    try {
      sessionStorage.setItem('demo_passcode', val)
    } catch {
      // sessionStorage might be restricted
    }
  }

  const handleCallSubmit = (e) => {
    e.preventDefault()
    if (phoneNumber.trim()) {
      startCall(phoneNumber.trim())
    }
  }

  const formatTimer = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0')
    const s = (totalSeconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const isInCall = status === 'in-call'
  const isConnecting = status === 'connecting'
  const isRinging = status === 'ringing'
  const isActiveCall = isInCall || isConnecting || isRinging

  const getStatusText = () => {
    switch (status) {
      case 'connecting':
        return 'Connecting...'
      case 'ringing':
        return 'Ringing...'
      case 'in-call':
        return 'Connected'
      case 'error':
        return 'Call failed'
      default:
        return 'Ready to call'
    }
  }

  return (
    <div className="call-widget">
      {/* ── Call Panel Card ───────────────────────────────────────── */}
      {isOpen && (
        <div 
          className="call-panel"
          role="region"
          aria-label="Phone call panel"
        >
          {/* Header */}
          <div className="call-panel__header">
            <div className="call-panel__title-row">
              <span className="call-panel__badge" aria-hidden="true">📞</span>
              <span className="call-panel__title">Phone call</span>
              {isInCall && (
                <span className="call-panel__live-indicator">LIVE</span>
              )}
            </div>
            <button 
              type="button" 
              className="call-panel__close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close call panel"
            >
              &times;
            </button>
          </div>

          <p className="call-panel__note">
            Real call to a phone number via Twilio. Demo mode: calls are routed to an approved test phone.
          </p>

          {/* Status Display */}
          <div className="call-panel__status-row">
            <span className="call-panel__label">Status</span>
            <span className={`call-panel__status-badge call-panel__status-badge--${status}`}>
              {getStatusText()}
            </span>
          </div>

          {/* Active Call Controls */}
          {isActiveCall ? (
            <div className="call-panel__active-box">
              <div className="call-panel__active-number">
                {phoneNumber || 'Outgoing call'}
              </div>

              {isInCall && (
                <div className="call-panel__timer">
                  {formatTimer(callSeconds)}
                </div>
              )}

              <div className="call-panel__active-actions">
                {isInCall && (
                  <button 
                    type="button" 
                    className={`call-btn call-btn--mute ${isMuted ? 'call-btn--muted' : ''}`}
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                  >
                    {isMuted ? '🔇 Unmute' : '🎙️ Mute'}
                  </button>
                )}
                <button 
                  type="button" 
                  className="call-btn call-btn--hangup"
                  onClick={hangUp}
                >
                  Hang up
                </button>
              </div>
            </div>
          ) : (
            /* Dial Controls (Idle / Error) */
            <form className="call-panel__dial-form" onSubmit={handleCallSubmit}>
              <div className="call-panel__field">
                <label htmlFor="call-passcode" className="call-panel__label">
                  Passcode
                </label>
                <input 
                  id="call-passcode"
                  type="password" 
                  className="call-panel__input"
                  placeholder="Enter demo passcode"
                  value={passcode}
                  onChange={handlePasscodeChange}
                  autoComplete="current-password"
                />
              </div>

              <div className="call-panel__field">
                <div className="call-panel__field-header">
                  <label htmlFor="call-phone-number" className="call-panel__label">
                    Phone number
                  </label>
                  <span className="call-panel__hint">+91XXXXXXXXXX</span>
                </div>
                <input 
                  id="call-phone-number"
                  type="tel" 
                  className="call-panel__input"
                  placeholder="+91XXXXXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  autoComplete="tel"
                />
                <div className="call-panel__preset-row">
                  <button 
                    type="button" 
                    className="call-panel__preset-btn"
                    onClick={() => setPhoneNumber('AI-Customer')}
                  >
                    🤖 Call AI Customer (Demo)
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className="call-btn call-btn--start"
                disabled={!phoneNumber.trim()}
              >
                Call
              </button>
            </form>
          )}

          {/* Error Box */}
          {errorMessage && (
            <div className="call-panel__error" role="alert">
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      )}

      {/* ── Floating Round Dial Button ────────────────────────────── */}
      <button 
        type="button"
        className={`call-widget__fab ${isRinging ? 'call-widget__fab--ringing' : ''} ${isInCall ? 'call-widget__fab--incall' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close phone call panel' : 'Open phone call panel'}
        aria-expanded={isOpen}
        title="Phone call"
      >
        <span className="call-widget__fab-icon" aria-hidden="true">
          📞
        </span>
        {isInCall && (
          <span className="call-widget__fab-badge" aria-hidden="true" />
        )}
      </button>
    </div>
  )
}

export default CallPanel
