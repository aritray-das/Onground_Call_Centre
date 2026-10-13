import { useState, useEffect, useRef } from 'react'
import { Bot, Trophy } from 'lucide-react'
import './PulseHome.css'
import { PULSE_KUDOS } from '../../data/mockData'

/**
 * PulseHome
 * 
 * Knowledge hub and agent directory for The Sleep Company call centre.
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

  const taskAgentsList = [
    {
      id: 'cross-sell',
      name: '# cross-sell-agent',
      percent: '24%',
      desc: 'Surfaces product add-ons and bundle recommendations during customer calls.',
    },
    {
      id: 'sop',
      name: '# sop-agent',
      percent: '61%',
      desc: 'Ensures compliance with The Sleep Company greeting and objection handling standards.',
    },
    {
      id: 'lead-conversion',
      name: '# lead-conversion-agent',
      percent: '78%',
      desc: 'Tracks lead progression and highlights high-urgency mattress purchase intent.',
    },
    {
      id: 'capture',
      name: '# capture-agent',
      percent: '91%',
      desc: 'Captures and structures customer order details and follow-up tasks automatically.',
    },
  ]

  return (
    <div className="pulse-home">
      {/* ── Purple Header ────────────────────────────────────────────────── */}
      <div className="pulse-header">
        <div className="pulse-header__top">
          <div className="pulse-header__title-group">
            <h1 className="pulse-header__title">Pulse</h1>
            <span className="pulse-header__subtitle">The Sleep Company · Knowledge</span>
          </div>
        </div>
        <div className="pulse-header__search">
          <input 
            type="text" 
            className="pulse-header__search-input" 
            placeholder="Ask AvaniBot or search Pulse..."
            aria-label="Ask AvaniBot or search Pulse"
          />
        </div>
      </div>

      {/* ── AvaniBot Card ─────────────────────────────────────────────────── */}
      <div className="pulse-avani">
        <div className="pulse-avani__header">
          <div className="pulse-avani__title-row">
            <span className="pulse-avani__icon" aria-hidden="true"><Bot size={18} /></span>
            <h2 className="pulse-avani__title">AvaniBot</h2>
          </div>
          <span className="pulse-avani__status">AGENTS ON</span>
        </div>
        
        <p className="pulse-avani__desc">
          Ask me about anything happening in Pulse — daily briefs, action items, quick answers.
        </p>

        <div className="pulse-avani__actions">
          {demoAvaniMsg ? (
            <span className="pulse-avani__demo-msg" role="status" aria-live="polite">
              {demoAvaniMsg}
            </span>
          ) : (
            <>
              <button 
                type="button"
                className="pulse-btn pulse-btn--primary"
                onClick={() => handleAvaniAction('Daily Brief')}
              >
                Daily Brief
              </button>
              <button 
                type="button"
                className="pulse-btn pulse-btn--outline"
                onClick={() => handleAvaniAction('Ask a question')}
              >
                Ask a question
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Single-Column Agent & Channel Directory ───────────────────────── */}
      <div className="pulse-directory">
        {/* CUSTOM AGENTS */}
        <section className="pulse-group">
          <h3 className="pulse-group__label">CUSTOM AGENTS</h3>
          <div className="pulse-list-row pulse-list-row--static">
            <span className="pulse-list-row__title">Custom Agents</span>
            <span className="pulse-list-row__sep">—</span>
            <span className="pulse-list-row__desc">Set up your own manager-friendly agent</span>
          </div>
        </section>

        {/* ROLE AGENTS */}
        <section className="pulse-group">
          <h3 className="pulse-group__label">ROLE AGENTS</h3>
          <button 
            type="button"
            className="pulse-list-row pulse-list-row--clickable"
            onClick={() => onNavigate?.('pulse-channel')}
            title="Open # callcentre-agent channel"
          >
            <div className="pulse-list-row__main">
              <span className="pulse-list-row__tag"># callcentre-agent</span>
              <span className="pulse-list-row__sep">—</span>
              <span className="pulse-list-row__desc">Call Centre Agent</span>
            </div>
            <span className="pulse-list-row__arrow" aria-hidden="true">&rarr;</span>
          </button>
        </section>

        {/* TASK AGENTS */}
        <section className="pulse-group">
          <h3 className="pulse-group__label">TASK AGENTS</h3>
          <div className="pulse-task-list">
            {taskAgentsList.map((task) => (
              <div key={task.id} className="pulse-task-row">
                <div className="pulse-task-row__info">
                  <span className="pulse-task-row__name">{task.name}</span>
                  <span className="pulse-task-row__desc">{task.desc}</span>
                </div>
                <span className="pulse-task-row__badge">{task.percent}</span>
              </div>
            ))}
          </div>
        </section>

        {/* GENERAL */}
        <section className="pulse-group">
          <h3 className="pulse-group__label">GENERAL</h3>
          <button 
            type="button"
            className="pulse-list-row pulse-list-row--clickable"
            onClick={() => onNavigate?.('pulse-channel')}
            title="Open # customer-discussions channel"
          >
            <div className="pulse-list-row__main">
              <span className="pulse-list-row__tag"># customer-discussions</span>
              <span className="pulse-list-row__sep">—</span>
              <span className="pulse-list-row__desc">Debated via WhatsApp Business</span>
            </div>
            <span className="pulse-list-row__arrow" aria-hidden="true">&rarr;</span>
          </button>
        </section>
      </div>

      {/* ── Amber Kudos Card ──────────────────────────────────────────────── */}
      <section className="pulse-kudos-card">
        <div className="pulse-kudos-card__header">
          <div className="pulse-kudos-card__title-row">
            <Trophy size={16} color="#d97706" aria-hidden="true" />
            <h3 className="pulse-kudos-card__title">Kudos</h3>
          </div>
          <span className="pulse-badge--new">NEW</span>
        </div>
        
        <p className="pulse-kudos-card__message">"{PULSE_KUDOS.message}"</p>
        
        <div className="pulse-kudos-card__meta">
          <span>To: <strong>{PULSE_KUDOS.receivedBy}</strong></span>
          <span>&middot;</span>
          <span>From: {PULSE_KUDOS.givenBy}</span>
          <span>&middot;</span>
          <span>{PULSE_KUDOS.timestamp}</span>
        </div>
      </section>
    </div>
  )
}

export default PulseHome
