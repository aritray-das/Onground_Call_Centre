import { useState } from 'react'
import './Dashboard.css'
import LeadsModal from '../leads/LeadsModal'
import { formatCurrency } from '../../utils/format'
import {
  AGENT,
  DASHBOARD_KPI,
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

  // Find the maximum value for the volume chart to scale bars appropriately
  const maxVolume = Math.max(...CHART_CALL_VOLUME.map(d => d.calls), 1)
  const totalTasks = TASKS.callbacks + TASKS.hotLeads + TASKS.outcomes

  return (
    <div className="dashboard">
      {/* ── Banner ──────────────────────────────────────────────────────── */}
      <div className="dashboard__banner">
        <div>
          <h1 className="dashboard__greeting">{AGENT.greeting}, {AGENT.name}</h1>
          <p className="dashboard__role">The Sleep Company · Call Centre</p>
        </div>
        <div className="dashboard__banner-actions">
          <div className="dashboard__status-pill">
            <span className="dashboard__status-dot" aria-hidden="true"></span>
            Online
          </div>
        </div>
      </div>

      {/* ── Tight KPI Cards Strip Directly Under Banner ──────────────────── */}
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

      {/* ── Green Card: MY PROGRESS · TODAY ─────────────────────────────── */}
      <section className="dashboard__progress-card">
        <h2 className="dashboard__progress-title">MY PROGRESS · TODAY</h2>
        <div className="dashboard__progress-counts">
          <div className="dashboard__progress-item">
            <span className="dashboard__progress-num">3</span>
            <span className="dashboard__progress-label">Leads created</span>
          </div>
          <div className="dashboard__progress-divider" aria-hidden="true" />
          <div className="dashboard__progress-item">
            <span className="dashboard__progress-num">2</span>
            <span className="dashboard__progress-label">Leads called</span>
          </div>
        </div>
      </section>

      {/* ── Two-Column Main Layout ───────────────────────────────────────── */}
      <div className="dashboard__main">
        {/* Left Column: Who's waiting */}
        <div className="dashboard__col">
          <section className="dash-card">
            <header className="dash-card__header">
              <h2 className="dash-card__title">Who's waiting</h2>
              <button 
                type="button"
                className="dash-action-btn" 
                onClick={() => onNavigate('plan-calls-to-make')}
              >
                Open planner &rarr;
              </button>
            </header>
            <div className="waitlist">
              {PEOPLE_WAITING.slice(0, 3).map((person, index) => {
                const isUrgent = index >= 2 || person.priority === 'high'
                return (
                  <div key={person.id} className="waitlist-item">
                    <div className="waitlist-item__avatar" aria-hidden="true">
                      {person.initials}
                    </div>
                    <div className="waitlist-item__content">
                      <div className="waitlist-item__header">
                        <span className="waitlist-item__name">{person.name}</span>
                        <span className={`waitlist-item__chip ${isUrgent ? 'waitlist-item__chip--red' : 'waitlist-item__chip--amber'}`}>
                          {person.timeLabel}
                        </span>
                      </div>
                      <p className="waitlist-item__note">{person.note}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        {/* Right Column: Earnings & My Tasks */}
        <div className="dashboard__col">
          {/* Earnings */}
          <section className="dash-card">
            <header className="dash-card__header">
              <h2 className="dash-card__title">My earnings this month</h2>
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
                    width: `${Math.min(100, (EARNINGS.earned / EARNINGS.target) * 100)}%`, 
                    backgroundColor: 'var(--color-green-600, #16a34a)' 
                  }}
                />
              </div>
              <p className="earnings-queued-note">
                {formatCurrency(EARNINGS.queued)} from queued work
              </p>
            </div>
          </section>

          {/* My Tasks (Dark brown / amber card) */}
          <section className="tasks-card">
            <header className="tasks-card__header">
              <div className="tasks-card__title-row">
                <h2 className="tasks-card__title">My Tasks</h2>
                <span className="tasks-card__badge">{totalTasks}</span>
              </div>
            </header>
            <div className="tasks-card__list">
              <div className="tasks-card__row">
                <div className="tasks-card__row-left">
                  <span className="tasks-card__icon" aria-hidden="true">📞</span>
                  <span className="tasks-card__row-title">2 callbacks</span>
                </div>
                <span className="tasks-card__row-muted">Due this afternoon</span>
              </div>
              <button 
                type="button"
                className="tasks-card__row tasks-card__row--actionable" 
                onClick={() => setIsLeadsModalOpen(true)}
                title="View Hot Leads"
                aria-haspopup="dialog"
                aria-expanded={isLeadsModalOpen}
              >
                <div className="tasks-card__row-left">
                  <span className="tasks-card__icon" aria-hidden="true">🔥</span>
                  <span className="tasks-card__row-title tasks-card__row-title--hot">2 hot leads</span>
                </div>
                <span className="tasks-card__row-muted">Click to inspect</span>
              </button>
              <div className="tasks-card__row">
                <div className="tasks-card__row-left">
                  <span className="tasks-card__icon" aria-hidden="true">✓</span>
                  <span className="tasks-card__row-title">1 outcome</span>
                </div>
                <span className="tasks-card__row-muted">Logged today</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ── Charts ──────────────────────────────────────────────────────── */}
      <div className="dashboard__charts">
        {/* Calls Handled Chart */}
        <section className="dash-card">
          <header className="dash-card__header">
            <h2 className="dash-card__title">Calls handled · last 7 days</h2>
          </header>
          <div className="chart-container" aria-label="Bar chart showing calls handled over the last 7 days">
            {CHART_CALL_VOLUME.map((data, index) => {
              const isLast = index === CHART_CALL_VOLUME.length - 1
              return (
                <div key={index} className="chart-bar-group">
                  <div className="chart-bar-wrapper">
                    <span className="chart-bar-value">{data.calls}</span>
                    <div 
                      className={`chart-bar ${isLast ? 'chart-bar--green-dark' : 'chart-bar--green'}`}
                      style={{ height: `${(data.calls / maxVolume) * 100}%` }}
                      title={`${data.calls} calls`}
                    />
                  </div>
                  <span className="chart-label">{data.day}</span>
                </div>
              )
            })}
          </div>
        </section>

        {/* Call Quality Chart */}
        <section className="dash-card">
          <header className="dash-card__header">
            <h2 className="dash-card__title">Call quality · last 7 days</h2>
          </header>
          <div className="chart-container" aria-label="Bar chart showing call quality score over the last 7 days">
            {CHART_CALL_QUALITY.map((data, index) => {
              const isLast = index === CHART_CALL_QUALITY.length - 1
              return (
                <div key={index} className="chart-bar-group">
                  <div className="chart-bar-wrapper">
                    <span className="chart-bar-value">{data.score}%</span>
                    <div 
                      className={`chart-bar ${isLast ? 'chart-bar--blue-dark' : 'chart-bar--blue'}`}
                      style={{ height: `${data.score}%` }}
                      title={`${data.score}%`}
                    />
                  </div>
                  <span className="chart-label">{data.day}</span>
                </div>
              )
            })}
          </div>
        </section>
      </div>

      {/* ── Leads Inspection Modal ──────────────────────────────────────── */}
      <LeadsModal 
        key={isLeadsModalOpen ? 'open' : 'closed'}
        isOpen={isLeadsModalOpen} 
        onClose={() => setIsLeadsModalOpen(false)} 
        leads={LEADS.slice(0, 5)} 
      />
    </div>
  )
}

export default Dashboard
