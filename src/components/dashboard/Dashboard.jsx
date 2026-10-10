import React from 'react'
import './Dashboard.css'
import {
  AGENT,
  DASHBOARD_KPI,
  TODAY_PROGRESS,
  PEOPLE_WAITING,
  EARNINGS,
  TASKS
} from '../../data/mockData'

/**
 * Dashboard
 * 
 * The main workspace overview. Displays KPI cards, progress trackers,
 * a list of people waiting, and task summaries.
 * 
 * Props:
 *   onNavigate: function(id: string) - Callback to switch navigation sections
 */
function Dashboard({ onNavigate }) {
  // Simple formatter for currency values based on mock data's currency settings
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: EARNINGS.currency,
      maximumFractionDigits: 0
    }).format(val)
  }

  return (
    <div className="dashboard">
      {/* ── Banner ──────────────────────────────────────────────────────── */}
      <div className="dashboard__banner">
        <div>
          <h1 className="dashboard__greeting">{AGENT.greeting}, {AGENT.name}</h1>
          <p className="dashboard__role">{AGENT.role} · {AGENT.team}</p>
        </div>
        <div className="dashboard__banner-actions">
          <div className="dashboard__status-pill">
            <span className="dashboard__status-dot" aria-hidden="true"></span>
            Online
          </div>
        </div>
      </div>

      {/* ── KPI Cards ───────────────────────────────────────────────────── */}
      <div className="dashboard__kpis">
        {DASHBOARD_KPI.map((kpi) => (
          <div key={kpi.id} className="kpi-card">
            <div className="kpi-card__label">{kpi.label}</div>
            <div className="kpi-card__value-row">
              <span className="kpi-card__value">
                {kpi.displayValue || kpi.value}{kpi.unit === '%' ? '%' : ''}
              </span>
              <span className={`kpi-card__trend kpi-card__trend--${kpi.trendDirection}`}>
                {kpi.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Layout ─────────────────────────────────────────────────── */}
      <div className="dashboard__main">
        {/* Left Column */}
        <div className="dashboard__col">
          
          {/* Today's Progress */}
          <section className="dash-card">
            <header className="dash-card__header">
              <h2 className="dash-card__title">{TODAY_PROGRESS.label}</h2>
            </header>
            <div>
              <div className="progress-meta">
                <span className="progress-meta__val">
                  {TODAY_PROGRESS.completed}{' '}
                  <span className="progress-meta__lbl">completed</span>
                </span>
                <span className="progress-meta__target">Target: {TODAY_PROGRESS.target}</span>
              </div>
              <div className="progress-track" aria-hidden="true">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${(TODAY_PROGRESS.completed / TODAY_PROGRESS.target) * 100}%`,
                    backgroundColor: 'var(--color-purple-500)'
                  }}
                />
              </div>
            </div>
          </section>

          {/* Earnings */}
          <section className="dash-card">
            <header className="dash-card__header">
              <h2 className="dash-card__title">Earnings</h2>
            </header>
            <div>
              <div className="progress-meta">
                <span className="progress-meta__val">{formatCurrency(EARNINGS.earned)}</span>
                <span className="progress-meta__target">Target: {formatCurrency(EARNINGS.target)}</span>
              </div>
              <div className="progress-track" aria-hidden="true">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${(EARNINGS.earned / EARNINGS.target) * 100}%`, 
                    backgroundColor: 'var(--color-green-600)' 
                  }}
                />
              </div>
              <p style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                + {formatCurrency(EARNINGS.queued)} from queued work
              </p>
            </div>
          </section>

          {/* My Tasks */}
          <section className="dash-card">
            <header className="dash-card__header">
              <h2 className="dash-card__title">My Tasks</h2>
            </header>
            <div className="tasks-grid">
              <div className="task-box">
                <span className="task-box__val">{TASKS.callbacks}</span>
                <span className="task-box__lbl">Callbacks</span>
              </div>
              <div 
                className="task-box task-box--actionable" 
                onClick={() => {
                  /* Prepared for later task */
                  console.log('Leads modal not yet implemented')
                }}
                title="View Hot Leads (Coming soon)"
              >
                <span className="task-box__val" style={{ color: 'var(--color-purple-600)' }}>
                  {TASKS.hotLeads}
                </span>
                <span className="task-box__lbl">Hot Leads</span>
              </div>
              <div className="task-box">
                <span className="task-box__val">{TASKS.outcomes}</span>
                <span className="task-box__lbl">Outcomes</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="dashboard__col">
          {/* Who's Waiting */}
          <section className="dash-card">
            <header className="dash-card__header">
              <h2 className="dash-card__title">Who's waiting</h2>
              <button 
                className="dash-action-btn" 
                onClick={() => onNavigate('plan-calls-to-make')}
              >
                Open planner &rarr;
              </button>
            </header>
            <div className="waitlist">
              {PEOPLE_WAITING.map((person) => (
                <div key={person.id} className="waitlist-item">
                  <div className="waitlist-item__avatar" aria-hidden="true">
                    {person.initials}
                  </div>
                  <div className="waitlist-item__content">
                    <div className="waitlist-item__header">
                      <span className="waitlist-item__name">{person.name}</span>
                      <span className="waitlist-item__time">{person.timeLabel}</span>
                    </div>
                    <p className="waitlist-item__note">{person.note}</p>
                    <div className="waitlist-item__meta">
                      {person.product} &middot; {formatCurrency(person.expectedValue)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
