import React, { useState } from 'react'
import './Practise.css'

const SCENARIOS = [
  {
    id: 'sc-1',
    tag: 'Cost Objection',
    title: 'Term Insurance Cost Objection',
    customerName: 'Rajesh K. (Simulated)',
    initials: 'RK',
    persona: 'Price-sensitive buyer',
    prompt:
      '"₹18,000 annually for a 1 Cr cover feels too high. A competitor quoted me ₹14,500 online. Why shouldn\'t I just go with them?"',
    talkingPoints:
      'Emphasize claim settlement ratio (98.4%), 24/7 dedicated claims manager, cashless hospicash rider, and no-dispute clause after 3 years.',
    options: [
      {
        id: 'opt-1',
        text: 'Acknowledge the price difference, highlight our 98.4% claim settlement ratio and dedicated claims concierges who handle hospital visits.',
        score: '96 / 100',
        feedback:
          'Excellent! Builds confidence without bashing competitors and anchors on peace of mind during actual claims.',
      },
      {
        id: 'opt-2',
        text: 'Offer to immediately downgrade the sum assured to ₹75 Lakhs to beat the competitor\'s price.',
        score: '58 / 100',
        feedback:
          'Sub-optimal: Reduces customer protection prematurely before demonstrating why the higher tier adds long-term security.',
      },
      {
        id: 'opt-3',
        text: 'Explain that cheaper online policies often include critical illness exclusions and claim paperwork delays.',
        score: '78 / 100',
        feedback:
          'Good points, but make sure to substantiate policy wording differences constructively rather than sounding defensive.',
      },
    ],
  },
  {
    id: 'sc-2',
    tag: 'Product Comparison',
    title: 'ULIP Lock-in vs Mutual Funds',
    customerName: 'Vikram D. (Simulated)',
    initials: 'VD',
    persona: 'Analytical investor',
    prompt:
      '"Why lock my money in a ULIP for 5 to 10 years when I can get better liquidity and similar market returns in equity mutual funds?"',
    talkingPoints:
      'Highlight dual benefit of life cover + market-linked growth, zero-tax maturity proceeds (Section 10(10D) limits), and free fund switching without capital gains taxes.',
    options: [
      {
        id: 'opt-1',
        text: 'Focus on tax efficiency: Explain tax-free fund switching between debt and equity, and the built-in term insurance safety net.',
        score: '94 / 100',
        feedback:
          'Outstanding! The tax-free switching benefit directly solves analytical customer comparison questions.',
      },
      {
        id: 'opt-2',
        text: 'Tell them mutual funds have higher fund management fees and are riskier than insurance.',
        score: '45 / 100',
        feedback:
          'Inaccurate: Regulated mutual fund expense ratios are very competitive. Focus on insurance plus tax-free switching advantages instead.',
      },
      {
        id: 'opt-3',
        text: 'Recommend splitting the portfolio between a pure term plan and liquid mutual funds if lock-in is a primary concern.',
        score: '84 / 100',
        feedback:
          'Consultative approach! Shows transparency and builds strong advisor credibility.',
      },
    ],
  },
  {
    id: 'sc-3',
    tag: 'Network Reassurance',
    title: 'Hospital Cashless Network Coverage',
    customerName: 'Ananya M. (Simulated)',
    initials: 'AM',
    persona: 'Family caregiver',
    prompt:
      '"My parents live in Chennai. How do I know our nearby multi-specialty hospitals are actually cashless under this floater policy?"',
    talkingPoints:
      'Explain 10,000+ cashless network hospitals, instant e-card pre-authorization within 60 minutes, and reimbursement fallback with 5-day SLA.',
    options: [
      {
        id: 'opt-1',
        text: 'Share that over 240 premier hospitals in Chennai are in-network with a 60-minute cashless approval guarantee, and offer to look up specific hospitals together.',
        score: '98 / 100',
        feedback:
          'Top tier! Direct, reassuring, and proactively offers to check specific hospitals to remove doubt.',
      },
      {
        id: 'opt-2',
        text: 'Assure them that almost all hospitals accept this insurance, so they don\'t need to worry about the list.',
        score: '50 / 100',
        feedback:
          'Risky: Vague generalizations can lead to unpleasant surprises during hospital admissions. Always verify network lists.',
      },
    ],
  },
]

/**
 * Practise
 * 
 * Interactive practice simulator for call center agents.
 * Allows trying different pitch rebuttals and customer handling scenarios
 * with local scoring and feedback.
 */
function Practise() {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0)
  const [selectedOptionId, setSelectedOptionId] = useState(null)
  const [showScript, setShowScript] = useState(false)

  const activeScenario = SCENARIOS[selectedScenarioIndex]
  const activeOption = activeScenario.options.find((opt) => opt.id === selectedOptionId)

  const handleScenarioChange = (index) => {
    setSelectedScenarioIndex(index)
    setSelectedOptionId(null)
    setShowScript(false)
  }

  const handleNextScenario = () => {
    const nextIdx = (selectedScenarioIndex + 1) % SCENARIOS.length
    handleScenarioChange(nextIdx)
  }

  return (
    <div className="practise-view">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="practise-header">
        <div>
          <h1 className="practise-header__title">Practise a call</h1>
          <p className="practise-header__subtitle">
            Sharpen objection handling, product pitches, and claim explanations in a simulated environment.
          </p>
        </div>
        <div className="practise-banner">
          <span aria-hidden="true">💡</span>
          <span>Local Demo &middot; Interactive simulation mode (no external calling service)</span>
        </div>
      </div>

      {/* ── Scenario Selection Tabs ─────────────────────────────────────── */}
      <div className="practise-scenarios" role="tablist" aria-label="Practice Scenarios">
        {SCENARIOS.map((sc, index) => {
          const isActive = index === selectedScenarioIndex
          return (
            <button
              key={sc.id}
              role="tab"
              aria-selected={isActive}
              className={`practise-scenario-tab ${isActive ? 'practise-scenario-tab--active' : ''}`}
              onClick={() => handleScenarioChange(index)}
            >
              <span className="practise-scenario-tab__tag">{sc.tag}</span>
              <span className="practise-scenario-tab__title">{sc.title}</span>
            </button>
          )
        })}
      </div>

      {/* ── Simulation Room ─────────────────────────────────────────────── */}
      <div className="practise-sim">
        {/* Customer Prompt Card */}
        <div className="practise-sim__customer">
          <div className="practise-sim__avatar" aria-hidden="true">
            {activeScenario.initials}
          </div>
          <div className="practise-sim__customer-info">
            <div className="practise-sim__customer-header">
              <span className="practise-sim__customer-name">{activeScenario.customerName}</span>
              <span className="practise-sim__persona-tag">{activeScenario.persona}</span>
            </div>
            <p className="practise-sim__prompt">{activeScenario.prompt}</p>
          </div>
        </div>

        {/* Options to Choose */}
        <div className="practise-sim__options-header">
          <span className="practise-sim__options-title">Select your response:</span>
        </div>

        <div className="practise-sim__options-list">
          {activeScenario.options.map((opt, i) => {
            const isSelected = selectedOptionId === opt.id
            const letter = String.fromCharCode(65 + i) // A, B, C...

            return (
              <button
                key={opt.id}
                type="button"
                className={`practise-option-btn ${isSelected ? 'practise-option-btn--selected' : ''}`}
                onClick={() => setSelectedOptionId(opt.id)}
                aria-pressed={isSelected}
              >
                <span className="practise-option-btn__key">{letter}.</span>
                <span>{opt.text}</span>
              </button>
            )
          })}
        </div>

        {/* Feedback Section */}
        {activeOption && (
          <div className="practise-feedback" role="region" aria-live="polite">
            <div className="practise-feedback__header">
              <span className="practise-feedback__score">
                Evaluation Score: {activeOption.score}
              </span>
            </div>
            <p className="practise-feedback__text">{activeOption.feedback}</p>
          </div>
        )}

        {/* Key Talking Points Accordion */}
        <div className="practise-script">
          <button
            type="button"
            className="practise-script__trigger"
            onClick={() => setShowScript((prev) => !prev)}
            aria-expanded={showScript}
          >
            <span>KEY TALKING POINTS &amp; SUGGESTED REBUTTAL</span>
            <span aria-hidden="true">{showScript ? '▲' : '▼'}</span>
          </button>
          {showScript && (
            <div className="practise-script__panel">
              <p>{activeScenario.talkingPoints}</p>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="practise-sim__actions">
          <button
            type="button"
            className="practise-btn practise-btn--outline"
            onClick={() => setSelectedOptionId(null)}
            disabled={!selectedOptionId}
          >
            Reset Selection
          </button>
          <button
            type="button"
            className="practise-btn practise-btn--primary"
            onClick={handleNextScenario}
          >
            Next Scenario &rarr;
          </button>
        </div>
      </div>
    </div>
  )
}

export default Practise
