import React, { useState, useEffect, useRef } from 'react'
import './PulseHome.css'
import { 
  PULSE_CUSTOM_AGENTS, 
  PULSE_ROLE_AGENTS, 
  PULSE_TASK_AGENTS, 
  PULSE_CHANNEL, 
  PULSE_KUDOS 
} from '../../data/mockData'

/**
 * PulseHome
 * 
 * Hub for AI agents, team communication, and shoutouts.
 */
function PulseHome({ onNavigate }) {
  const [demoAvaniMsg, setDemoAvaniMsg] = useState(null)
  const timeoutRef = useRef(null)

  const handleAvaniAction = (actionName) => {
    setDemoAvaniMsg(`Demo: "${actionName}" action triggered. (No real AI connected)`)
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    
    timeoutRef.current = setTimeout(() => {
      setDemoAvaniMsg(null)
    }, 4000)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div className="pulse-home">
      {/* ── Pulse Header ────────────────────────────────────────────────── */}
      <div className="pulse-header">
        <div className="pulse-header__top">
          <div className="pulse-header__title-group">
            <span className="pulse-header__subtitle">The Sleep Company &middot; Knowledge</span>
            <h1 className="pulse-header__title">Pulse</h1>
          </div>
        </div>
        <div className="pulse-header__search">
          <input 
            type="text" 
            className="pulse-header__search-input" 
            placeholder="Ask AvaniBot or search Pulse..."
            aria-label="Search Pulse or ask AvaniBot"
          />
        </div>
      </div>

      {/* ── Main Layout ─────────────────────────────────────────────────── */}
      <div className="pulse-layout">
        
        {/* Left Column: Agents */}
        <div className="pulse-col">
          
          {/* AvaniBot Card */}
          <div className="pulse-avani">
            <div className="pulse-avani__header">
              <h2 className="pulse-avani__title">
                🤖 AvaniBot
              </h2>
              <span className="pulse-avani__status">AGENTS ON</span>
            </div>
            
            <div className="pulse-avani__actions">
              {demoAvaniMsg ? (
                <span className="pulse-avani__demo-msg" role="status" aria-live="polite">
                  {demoAvaniMsg}
                </span>
              ) : (
                <>
                  <button 
                    className="pulse-btn pulse-btn--primary"
                    onClick={() => handleAvaniAction('Daily Brief')}
                  >
                    Daily Brief
                  </button>
                  <button 
                    className="pulse-btn pulse-btn--outline"
                    onClick={() => handleAvaniAction('Ask a question')}
                  >
                    Ask a question
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Task Agents */}
          <div className="pulse-section">
            <h3 className="pulse-section__title">Task Agents</h3>
            <div className="pulse-grid">
              {PULSE_TASK_AGENTS.map((agent) => (
                <div key={agent.id} className="pulse-agent-card">
                  <div className="pulse-agent-card__header">
                    <div className="pulse-agent-card__identity">
                      <div className="pulse-agent-card__avatar" aria-hidden="true">
                        {agent.avatarEmoji}
                      </div>
                      <span className="pulse-agent-card__name">{agent.name}</span>
                    </div>
                    {agent.percentComplete !== undefined && (
                      <span className="pulse-agent-card__percent">{agent.percentComplete}%</span>
                    )}
                  </div>
                  <p className="pulse-agent-card__desc">{agent.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Role Agents */}
          <div className="pulse-section">
            <h3 className="pulse-section__title">Role Agents</h3>
            <div className="pulse-grid">
              {PULSE_ROLE_AGENTS.map((agent) => (
                <div key={agent.id} className="pulse-agent-card">
                  <div className="pulse-agent-card__header">
                    <div className="pulse-agent-card__identity">
                      <div className="pulse-agent-card__avatar pulse-agent-card__avatar--role" aria-hidden="true">
                        {agent.initials}
                      </div>
                      <span className="pulse-agent-card__name">{agent.name}</span>
                    </div>
                  </div>
                  <p className="pulse-agent-card__desc">
                    {agent.agentName} &middot; {agent.description}
                  </p>
                  <span className="pulse-agent-card__meta">Status: {agent.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Agents */}
          <div className="pulse-section">
            <h3 className="pulse-section__title">Custom Agents</h3>
            <div className="pulse-grid">
              {PULSE_CUSTOM_AGENTS.map((agent) => (
                <div key={agent.id} className="pulse-agent-card">
                  <div className="pulse-agent-card__header">
                    <div className="pulse-agent-card__identity">
                      <div className="pulse-agent-card__avatar" aria-hidden="true">
                        {agent.avatarEmoji}
                      </div>
                      <span className="pulse-agent-card__name">{agent.name}</span>
                    </div>
                  </div>
                  <p className="pulse-agent-card__desc">{agent.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Channels & Kudos */}
        <div className="pulse-col">
          
          {/* General Channel */}
          <div className="pulse-side-card">
            <h3 className="pulse-side-card__title">Channels</h3>
            <button 
              className="pulse-channel-row"
              onClick={() => {
                // If a channel view is implemented later (Task 11), it will route here.
                // For now, it just logs or does a safe no-op if onNavigate isn't provided.
                if (onNavigate) onNavigate('pulse-channel')
              }}
            >
              <span className="pulse-channel-row__name"># {PULSE_CHANNEL.name}</span>
              <span className="pulse-channel-row__count">{PULSE_CHANNEL.unreadCount} unread</span>
            </button>
          </div>

          {/* Kudos */}
          <div className="pulse-side-card">
            <div className="pulse-side-card__header">
              <h3 className="pulse-side-card__title">Recent Kudos</h3>
              <span className="pulse-badge--new">New</span>
            </div>
            
            <p className="pulse-kudos__message">"{PULSE_KUDOS.message}"</p>
            
            <div className="pulse-kudos__meta">
              <span>To: <strong>{PULSE_KUDOS.receivedBy}</strong></span>
              <span>From: {PULSE_KUDOS.givenBy}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default PulseHome
