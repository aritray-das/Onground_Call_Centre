import { useState, useEffect, useRef } from 'react'
import './CallPanel.css'
import { usePeerCall } from '../../hooks/usePeerCall'

/**
 * CallPanel
 * 
 * Floating in-app voice call widget powered by WebRTC (PeerJS).
 * Mounts globally in AppShell and provides peer-to-peer audio calls.
 */
function CallPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [prevStatus, setPrevStatus] = useState('connecting')
  const [targetId, setTargetId] = useState('')
  const [copied, setCopied] = useState(false)
  const audioRef = useRef(null)

  const {
    myId,
    status,
    errorMessage,
    callerId,
    startCall,
    answer,
    decline,
    hangUp,
    toggleMute,
    isMuted,
    callSeconds,
    remoteStream,
  } = usePeerCall()

  // Automatically open panel when call becomes active (ringing, calling, in-call)
  if (status !== prevStatus) {
    setPrevStatus(status)
    if (status === 'ringing' || status === 'calling' || status === 'in-call') {
      setIsOpen(true)
    }
  }

  // Listen for global custom event 'open-call-panel' (e.g. from Incoming call buttons)
  useEffect(() => {
    const handleGlobalOpen = () => {
      setIsOpen(true)
    }
    window.addEventListener('open-call-panel', handleGlobalOpen)
    return () => {
      window.removeEventListener('open-call-panel', handleGlobalOpen)
    }
  }, [])

  // Attach remote stream to audio element
  useEffect(() => {
    if (audioRef.current && remoteStream) {
      audioRef.current.srcObject = remoteStream
      audioRef.current.play().catch(() => {
        // Autoplay may require prior user interaction
      })
    }
  }, [remoteStream])

  const handleCopyId = () => {
    if (!myId) return
    navigator.clipboard.writeText(myId).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {
      // Fallback
    })
  }

  const handleCallSubmit = (e) => {
    e.preventDefault()
    if (targetId.trim()) {
      startCall(targetId.trim())
    }
  }

  const formatTimer = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0')
    const s = (totalSeconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const isInCall = status === 'in-call'
  const isCalling = status === 'calling'
  const isRinging = status === 'ringing'

  return (
    <div className="call-widget">
      {/* Hidden audio element for remote stream playback */}
      <audio ref={audioRef} autoPlay playsInline />

      {/* ── Call Panel Card ───────────────────────────────────────── */}
      {isOpen && (
        <div 
          className="call-panel"
          role="region"
          aria-label="In-app voice call panel"
        >
          {/* Header */}
          <div className="call-panel__header">
            <div className="call-panel__title-row">
              <span className="call-panel__badge" aria-hidden="true">📞</span>
              <span className="call-panel__title">In-app call</span>
              {status === 'in-call' && (
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
            Real browser-to-browser voice call (WebRTC). Open this app on two devices to try it.
          </p>

          {/* ── Status: Ringing (Incoming Call) ───────────────────── */}
          {isRinging && (
            <div className="call-panel__ringing-box">
              <div className="call-panel__ringing-icon" aria-hidden="true">🔔</div>
              <div className="call-panel__ringing-text">Incoming call from</div>
              <div className="call-panel__ringing-caller">{callerId}</div>
              <div className="call-panel__ringing-actions">
                <button 
                  type="button" 
                  className="call-btn call-btn--answer"
                  onClick={answer}
                >
                  Answer
                </button>
                <button 
                  type="button" 
                  className="call-btn call-btn--decline"
                  onClick={decline}
                >
                  Decline
                </button>
              </div>
            </div>
          )}

          {/* ── Status: Calling or In-Call ───────────────────────── */}
          {(isCalling || isInCall) && (
            <div className="call-panel__active-box">
              <div className="call-panel__active-status">
                {isCalling ? 'Calling peer...' : 'Connected'}
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
          )}

          {/* ── Status: Idle / Ready — Dialing controls ──────────── */}
          {!isRinging && !isCalling && !isInCall && (
            <div className="call-panel__idle">
              {/* Your Call ID */}
              <div className="call-panel__id-section">
                <span className="call-panel__label">Your call ID</span>
                <div className="call-panel__id-display">
                  <span className="call-panel__id-code">
                    {myId || (status === 'connecting' ? 'Generating ID...' : 'Offline')}
                  </span>
                  <button 
                    type="button"
                    className="call-btn--copy"
                    onClick={handleCopyId}
                    disabled={!myId}
                    title="Copy your call ID"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Enter ID to Call */}
              <form className="call-panel__dial-form" onSubmit={handleCallSubmit}>
                <label htmlFor="target-call-id" className="call-panel__label">
                  Enter ID to call
                </label>
                <div className="call-panel__dial-row">
                  <input 
                    id="target-call-id"
                    type="text" 
                    className="call-panel__input"
                    placeholder="e.g. og-abc12"
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    disabled={status === 'connecting'}
                    autoComplete="off"
                  />
                  <button 
                    type="submit" 
                    className="call-btn call-btn--start"
                    disabled={status === 'connecting' || !targetId.trim()}
                  >
                    Call
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Error Message */}
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
        aria-label={isOpen ? 'Close in-app voice call panel' : 'Open in-app voice call panel'}
        aria-expanded={isOpen}
        title="In-app voice call"
      >
        <span className="call-widget__fab-icon" aria-hidden="true">
          {isInCall ? '📞' : isRinging ? '🔔' : '📞'}
        </span>
        {isInCall && (
          <span className="call-widget__fab-badge" aria-hidden="true" />
        )}
      </button>
    </div>
  )
}

export default CallPanel
