import React, { useState } from 'react'
import './Dashboard.css'
import LeadsModal from '../leads/LeadsModal'
import {
  AGENT,
  DASHBOARD_KPI,
  TODAY_PROGRESS,
  PEOPLE_WAITING,
  EARNINGS,
  TASKS,
  CHART_CALL_VOLUME,
  CHART_CALL_QUALITY,
  LEADS
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
  const [isLeadsModalOpen, setIsLeadsModalOpen] = useState(false)

  // Simple formatter for currency values based on mock data's currency settings
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: EARNINGS.currency,
      maximumFractionDigits: 0
    }).format(val)
  }

  // Find the maximum value for the volume chart to scale bars appropriately
  const maxVolume = Math.max(...CHART_CALL_VOLUME.map(d => d.calls), 1)

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
              <button 
                type="button"
                className="task-box task-box--actionable" 
                onClick={() => setIsLeadsModalOpen(true)}
                title="View Hot Leads"
                aria-haspopup="dialog"
                aria-expanded={isLeadsModalOpen}
              >
                <span className="task-box__val" style={{ color: 'var(--color-purple-600)' }}>
                  {TASKS.hotLeads}
                </span>
                <span className="task-box__lbl">Hot Leads</span>
              </button>
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

      {/* ── Charts ──────────────────────────────────────────────────────── */}
      <div className="dashboard__charts">
        {/* Calls Handled Chart */}
        <section className="dash-card">
          <header className="dash-card__header">
            <h2 className="dash-card__title">Calls handled — last 7 days</h2>
          </header>
          <div className="chart-container" aria-label="Bar chart showing calls handled over the last 7 days">
            {CHART_CALL_VOLUME.map((data, index) => (
              <div key={index} className="chart-bar-group">
                <div className="chart-bar-wrapper">
                  <div 
                    className="chart-bar chart-bar--green" 
                    style={{ height: `${(data.calls / maxVolume) * 100}%` }}
                    title={`${data.calls} calls`}
                  >
                    <div className="chart-tooltip">{data.calls}</div>
                  </div>
                </div>
                <span className="chart-label">{data.day}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Call Quality Chart */}
        <section className="dash-card">
          <header className="dash-card__header">
            <h2 className="dash-card__title">Call quality — last 7 days</h2>
          </header>
          <div className="chart-container" aria-label="Bar chart showing call quality score over the last 7 days">
            {CHART_CALL_QUALITY.map((data, index) => (
              <div key={index} className="chart-bar-group">
                <div className="chart-bar-wrapper">
                  <div 
                    className="chart-bar chart-bar--blue" 
                    style={{ height: `${data.score}%` }}
                    title={`${data.score}%`}
                  >
                    <div className="chart-tooltip">{data.score}%</div>
                  </div>
                </div>
                <span className="chart-label">{data.day}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── Leads Inspection Modal ──────────────────────────────────────── */}
      <LeadsModal 
        isOpen={isLeadsModalOpen} 
        onClose={() => setIsLeadsModalOpen(false)} 
        leads={LEADS.slice(0, 5)} 
      />
    </div>
  )
}

export default Dashboard
