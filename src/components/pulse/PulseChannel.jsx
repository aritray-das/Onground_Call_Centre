import React, { useState, useEffect, useRef } from 'react'
import './PulseChannel.css'
import { PULSE_CHANNEL, PULSE_CHAT, PULSE_AGENT } from '../../data/mockData'

/**
 * PulseChannel
 * 
 * Detailed channel view showing pinned tasks and chat history.
 */
function PulseChannel({ onNavigate }) {
  // We initialize the chat messages with mock data
  const [messages, setMessages] = useState(PULSE_CHAT.messages)
  const [inputText, setInputText] = useState('')
  const messagesEndRef = useRef(null)
  
  // Local demo state for the pinned callback card actions
  const [pinnedStatus, setPinnedStatus] = useState(null)
  const pinnedTimeoutRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handlePinnedAction = (action) => {
    setPinnedStatus(`Demo: ${action}`)
    if (pinnedTimeoutRef.current) clearTimeout(pinnedTimeoutRef.current)
    pinnedTimeoutRef.current = setTimeout(() => {
      setPinnedStatus(null)
    }, 4000)
  }

  useEffect(() => {
    return () => {
      if (pinnedTimeoutRef.current) clearTimeout(pinnedTimeoutRef.current)
    }
  }, [])

  const handleSendMessage = (e) => {
    e.preventDefault()
    const trimmed = inputText.trim()
    if (!trimmed) return

    const newMessage = {
      id: `msg-local-${Date.now()}`,
      sender: PULSE_AGENT.name,
      initials: PULSE_AGENT.initials,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      messageType: 'text',
      text: trimmed,
    }

    setMessages((prev) => [...prev, newMessage])
    setInputText('')
  }

  return (
    <div className="pulse-channel-view">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="channel-header">
        <button 
          className="channel-header__back-btn" 
          onClick={() => onNavigate('pulse')}
          aria-label="Back to Pulse Home"
        >
          &larr; Back
        </button>
        <div className="channel-header__info">
          <h1 className="channel-header__title"># {PULSE_CHANNEL.name}</h1>
          <span className="channel-header__subtitle">{PULSE_CHANNEL.description}</span>
        </div>
      </div>

      {/* ── Main Layout ─────────────────────────────────────────────────── */}
      <div className="channel-layout">
        
        {/* Pinned Card */}
        <div className="channel-pinned">
          <div className="channel-pinned__header">
            <span className="channel-pinned__label">Needs your input</span>
            <span className="channel-pinned__title">{PULSE_CHAT.pinnedItem.text}</span>
          </div>
          <p className="channel-pinned__context">
            Contact: <strong>{PULSE_CHAT.pinnedItem.relatedContact}</strong> 
            &nbsp;&middot;&nbsp; Requested by {PULSE_CHAT.pinnedItem.setBy} at {PULSE_CHAT.pinnedItem.timestamp}
          </p>
          
          <div className="channel-pinned__actions">
            {pinnedStatus ? (
              <span className="channel-pinned__demo-msg" role="status" aria-live="polite">
                {pinnedStatus}
              </span>
            ) : (
              <>
                <button 
                  className="channel-pinned__btn channel-pinned__btn--primary"
                  onClick={() => handlePinnedAction('Confirmed')}
                >
                  Confirmed
                </button>
                <button 
                  className="channel-pinned__btn channel-pinned__btn--outline"
                  onClick={() => handlePinnedAction('Reschedule')}
                >
                  Reschedule
                </button>
              </>
            )}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="channel-messages">
          {messages.map((msg) => {
            const isSelf = msg.initials === PULSE_AGENT.initials

            return (
              <div key={msg.id} className={`chat-msg ${isSelf ? 'chat-msg--self' : ''}`}>
                <div className="chat-msg__avatar" aria-hidden="true">
                  {msg.initials}
                </div>
                <div className="chat-msg__content">
                  <div className="chat-msg__meta">
                    <span className="chat-msg__sender">{msg.sender}</span>
                    <span className="chat-msg__time">{msg.timestamp}</span>
                  </div>
                  <div className="chat-msg__bubble">
                    {msg.text}
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Composer */}
        <div className="channel-composer">
          <form className="channel-composer__form" onSubmit={handleSendMessage}>
            <input 
              type="text" 
              className="channel-composer__input"
              placeholder={`Message #${PULSE_CHANNEL.name}`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              aria-label={`Message ${PULSE_CHANNEL.name} channel`}
            />
            <button 
              type="submit" 
              className="channel-composer__send-btn"
              disabled={!inputText.trim()}
            >
              Send
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}

export default PulseChannel
