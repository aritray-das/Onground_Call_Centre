import { useState, useEffect, useRef } from 'react'
import './PulseChannel.css'

const INITIAL_MESSAGES = [
  {
    id: 'msg-1',
    sender: 'Sunita Rao',
    initials: 'SR',
    timestamp: '2:08pm',
    isSelf: false,
    prefix: 'STAKEHOLDERS:',
    text: '@You (Arvind R.), whole call centre shift',
  },
  {
    id: 'msg-2',
    sender: 'Sunita Rao',
    initials: 'SR',
    timestamp: '2:09pm',
    isSelf: false,
    prefix: 'ISSUE DEFINITION:',
    text: 'Greeting-in-first-10s QA score is at 71% this week, below our 85% target.',
  },
  {
    id: 'msg-3',
    sender: 'Sunita Rao',
    initials: 'SR',
    timestamp: '2:09pm',
    isSelf: false,
    prefix: 'SUGGESTED RESOLUTION:',
    text: "Let's push that up. Open every call with the greeting script. I'll check back Friday.",
  },
  {
    id: 'msg-4',
    sender: 'You',
    initials: 'AR',
    timestamp: '2:13pm',
    isSelf: true,
    text: 'On it! Will make sure I open every call with the greeting script 👍',
  },
  {
    id: 'msg-5',
    sender: 'Sunita Rao',
    initials: 'SR',
    timestamp: '2:14pm',
    isSelf: false,
    text: 'Great attitude Arvind 🌟',
  },
]

/**
 * PulseChannel
 * 
 * Channel view for # callcentre-team with pinned input flow and team chat.
 */
function PulseChannel({ onNavigate }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [inputText, setInputText] = useState('')
  const [pinnedResolved, setPinnedResolved] = useState(false)
  const [pinnedAnswer, setPinnedAnswer] = useState('')
  const [pinnedInput, setPinnedInput] = useState('')

  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const getCurrentTimeString = () => {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes().toString().padStart(2, '0')
    const ampm = hours >= 12 ? 'pm' : 'am'
    const formattedHours = hours % 12 || 12
    return `${formattedHours}:${minutes}${ampm}`
  }

  const addMessageFromYou = (text) => {
    const newMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      sender: 'You',
      initials: 'AR',
      timestamp: getCurrentTimeString(),
      isSelf: true,
      text,
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const handlePinnedAction = (answer) => {
    if (pinnedResolved || !answer) return
    setPinnedResolved(true)
    setPinnedAnswer(answer)
    addMessageFromYou(answer)
  }

  const handlePinnedInputSubmit = (e) => {
    e.preventDefault()
    const trimmed = pinnedInput.trim()
    if (!trimmed) return
    handlePinnedAction(trimmed)
    setPinnedInput('')
  }

  const handleComposerSubmit = (e) => {
    e.preventDefault()
    const trimmed = inputText.trim()
    if (!trimmed) return
    addMessageFromYou(trimmed)
    setInputText('')
  }

  return (
    <div className="pulse-channel-view">
      {/* ── Purple Header ────────────────────────────────────────────────── */}
      <div className="channel-header">
        <button 
          type="button"
          className="channel-header__round-back" 
          onClick={() => onNavigate?.('pulse')}
          aria-label="Back to Pulse Home"
        >
          &larr;
        </button>
        <div className="channel-header__info">
          <h1 className="channel-header__title"># callcentre-team</h1>
          <span className="channel-header__subtitle">The Sleep Company · Team Operations</span>
        </div>
      </div>

      {/* ── Main Layout ─────────────────────────────────────────────────── */}
      <div className="channel-layout">
        
        {/* Pinned "Needs your input" Card */}
        <div className="channel-pinned">
          <div className="channel-pinned__header">
            <div className="channel-pinned__tags">
              {!pinnedResolved && (
                <span className="channel-pinned__badge">1</span>
              )}
              <span className="channel-pinned__label">Needs your input</span>
              <span className="channel-pinned__pinned-tag">pinned</span>
            </div>
          </div>

          <div className="channel-pinned__body">
            <h2 className="channel-pinned__title">Confirm the 4:30pm callback</h2>
            <p className="channel-pinned__subline">Priya Iyer &middot; likely billing dispute</p>
          </div>
          
          <div className="channel-pinned__actions-area">
            {pinnedResolved ? (
              <div className="channel-pinned__resolved-badge">
                Answered: <strong>{pinnedAnswer}</strong>
              </div>
            ) : (
              <div className="channel-pinned__interaction">
                <div className="channel-pinned__buttons">
                  <button 
                    type="button"
                    className="channel-pinned__btn channel-pinned__btn--confirmed"
                    onClick={() => handlePinnedAction('Confirmed')}
                  >
                    Confirmed
                  </button>
                  <button 
                    type="button"
                    className="channel-pinned__btn channel-pinned__btn--reschedule"
                    onClick={() => handlePinnedAction('Reschedule')}
                  >
                    Reschedule
                  </button>
                </div>

                <form className="channel-pinned__input-form" onSubmit={handlePinnedInputSubmit}>
                  <input 
                    type="text" 
                    className="channel-pinned__text-input"
                    placeholder="Or type your answer"
                    value={pinnedInput}
                    onChange={(e) => setPinnedInput(e.target.value)}
                    aria-label="Type your answer for callback confirmation"
                  />
                  <button 
                    type="submit" 
                    className="channel-pinned__orange-send-btn"
                    disabled={!pinnedInput.trim()}
                    aria-label="Send answer"
                  >
                    Send
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="channel-messages">
          {/* Centered Date Divider */}
          <div className="channel-divider">
            <span className="channel-divider__line"></span>
            <span className="channel-divider__text">Today &middot; Call Centre Team</span>
            <span className="channel-divider__line"></span>
          </div>

          {messages.map((msg) => {
            const isSelf = msg.isSelf

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
                  <div className={`chat-msg__bubble ${isSelf ? 'chat-msg__bubble--green' : ''}`}>
                    {msg.prefix && <strong>{msg.prefix} </strong>}
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
          <form className="channel-composer__form" onSubmit={handleComposerSubmit}>
            <button 
              type="button" 
              className="channel-composer__emoji-btn"
              onClick={() => setInputText((prev) => prev + ' 👍')}
              aria-label="Insert emoji"
            >
              😊
            </button>
            <input 
              type="text" 
              className="channel-composer__input"
              placeholder="Message #callcentre-team..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              aria-label="Message #callcentre-team channel"
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
