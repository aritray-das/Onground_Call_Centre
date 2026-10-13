import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import './Calendar.css'
import { CALENDAR_META, CALENDAR_EVENTS } from '../../data/mockData'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// Helper to format Date to 'YYYY-MM-DD' safely in local time
const toDateString = (year, month, day) => {
  const y = year
  const m = String(month).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Calendar
 * 
 * View for scheduling and events. Implements a responsive month grid,
 * month-to-month navigation, and event-detail selection.
 */
function Calendar() {
  // Initialize with the mock data's reference date
  const [currentYear, setCurrentYear] = useState(CALENDAR_META.year)
  const [currentMonth, setCurrentMonth] = useState(CALENDAR_META.month) // 1-12
  
  // Selected date defaults to the highlighted date
  const initialSelectedDateStr = toDateString(
    CALENDAR_META.year, 
    CALENDAR_META.month, 
    CALENDAR_META.highlightedDate
  )
  const [selectedDateStr, setSelectedDateStr] = useState(initialSelectedDateStr)

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12)
      setCurrentYear((prev) => prev - 1)
    } else {
      setCurrentMonth((prev) => prev - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1)
      setCurrentYear((prev) => prev + 1)
    } else {
      setCurrentMonth((prev) => prev + 1)
    }
  }

  const handleToday = () => {
    setCurrentYear(CALENDAR_META.year)
    setCurrentMonth(CALENDAR_META.month)
    setSelectedDateStr(initialSelectedDateStr)
  }

  // Generate grid days
  const grid = useMemo(() => {
    // JS Date month is 0-indexed.
    const firstDay = new Date(currentYear, currentMonth - 1, 1)
    const lastDay = new Date(currentYear, currentMonth, 0)
    const daysInMonth = lastDay.getDate()
    
    // JS Date.getDay(): 0=Sun, 1=Mon, ..., 6=Sat
    // We want Mon=0, Sun=6
    const jsDay = firstDay.getDay()
    const startDayIndex = jsDay === 0 ? 6 : jsDay - 1

    const days = []
    
    // Add empty slots for previous month
    for (let i = 0; i < startDayIndex; i++) {
      days.push(null)
    }
    
    // Add days for current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days
  }, [currentYear, currentMonth])

  // Get selected day's events
  const selectedEvents = useMemo(() => {
    return CALENDAR_EVENTS.filter((e) => e.date === selectedDateStr)
  }, [selectedDateStr])

  // Get month name
  const monthName = new Date(currentYear, currentMonth - 1, 1).toLocaleString('default', { month: 'long' })

  // Check if a specific day in the currently rendered month has events
  const hasEvents = (day) => {
    if (!day) return false
    const dateStr = toDateString(currentYear, currentMonth, day)
    return CALENDAR_EVENTS.some((e) => e.date === dateStr)
  }

  // Format a friendly date string for the details panel header
  const formatSelectedDateFriendly = () => {
    const [y, m, d] = selectedDateStr.split('-')
    const dateObj = new Date(Number(y), Number(m) - 1, Number(d))
    return dateObj.toLocaleDateString('default', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  return (
    <div className="calendar-view">
      {/* ── Banner & Header ─────────────────────────────────────────────── */}
      <div className="calendar-banner">
        <span className="calendar-banner__icon" aria-hidden="true">ℹ️</span>
        <span className="calendar-banner__text">
          Share visits, coaching sessions and meeting invites will show up here — and in your mailbox.
        </span>
      </div>

      <div className="calendar-header">
        <div className="calendar-header__title-group">
          <h1 className="calendar-header__title">Calendar</h1>
          <p className="calendar-header__subtitle">Schedule your callbacks and meetings.</p>
        </div>
      </div>

      {/* ── Layout ──────────────────────────────────────────────────────── */}
      <div className="calendar-main">
        {/* Left Column: Grid */}
        <div className="calendar-grid-card">
          <div className="calendar-grid-card__header">
            <h2 className="calendar-grid-card__title">
              {monthName} {currentYear}
            </h2>
            <div className="calendar-grid-card__controls">
              <button 
                type="button"
                className="calendar-btn" 
                onClick={handlePrevMonth} 
                aria-label="Previous month"
              >
                <ChevronLeft size={14} style={{ marginRight: 4 }} /> Prev
              </button>
              <button 
                type="button"
                className="calendar-btn calendar-btn--today" 
                onClick={handleToday}
              >
                Today
              </button>
              <button 
                type="button"
                className="calendar-btn" 
                onClick={handleNextMonth} 
                aria-label="Next month"
              >
                Next <ChevronRight size={14} style={{ marginLeft: 4 }} />
              </button>
            </div>
          </div>

          <div className="calendar-grid">
            {WEEKDAYS.map((day) => (
              <div key={day} className="calendar-grid__weekday">
                {day}
              </div>
            ))}
            
            {grid.map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} className="calendar-grid__day calendar-grid__day--empty" />
              }

              const dateStr = toDateString(currentYear, currentMonth, day)
              const isSelected = selectedDateStr === dateStr
              const isToday = 
                day === CALENDAR_META.highlightedDate && 
                currentMonth === CALENDAR_META.month && 
                currentYear === CALENDAR_META.year
              const dayHasEvents = hasEvents(day)

              return (
                <button
                  key={`day-${day}`}
                  className={`calendar-grid__day ${isToday ? 'calendar-grid__day--today' : ''} ${isSelected ? 'calendar-grid__day--selected' : ''}`}
                  onClick={() => setSelectedDateStr(dateStr)}
                  aria-label={`${dateStr}${dayHasEvents ? ' (has events)' : ''}${isToday ? ' (today)' : ''}`}
                  aria-pressed={isSelected}
                >
                  {day}
                  {dayHasEvents && <div className="calendar-grid__day-event-dot" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Column: Selected Details */}
        <div className="calendar-details">
          <h2 className="calendar-details__title">
            {formatSelectedDateFriendly()}
          </h2>
          
          {selectedEvents.length === 0 ? (
            <p className="calendar-details__empty">No events scheduled for this day.</p>
          ) : (
            selectedEvents.map((ev) => (
              <div key={ev.id} className="calendar-details__event">
                <div className="calendar-details__event-header">
                  <span className="calendar-details__event-title">{ev.title}</span>
                  <span className="calendar-details__event-time">{ev.time}</span>
                </div>
                <p className="calendar-details__event-desc">{ev.description}</p>
                <span className="calendar-details__event-type">{ev.eventType}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Calendar
