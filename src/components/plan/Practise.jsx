import { useState } from 'react'
import { Lightbulb } from 'lucide-react'
import './Practise.css'

const SCENARIOS = [
  {
    id: 'sc-1',
    tag: 'Price Objection',
    title: 'Competitor Price Objection',
    customerName: 'Rajesh K. (Simulated)',
    initials: 'RK',
    persona: 'Price-sensitive buyer',
    prompt:
      '"₹9,490 for the Ortho GRID mattress feels steep. A local brand online is offering a memory foam mattress for ₹6,500. Why should I pay more for yours?"',
    talkingPoints:
      'Highlight patented SmartGRID technology that does not sink or trap body heat like traditional foam, 2,500+ air channels for cooling, ergonomic spine alignment, and zero-sag durability.',
    options: [
      {
        id: 'opt-1',
        text: 'Acknowledge the price difference, explain that cheap foam traps body heat and sags within 2 years, whereas our patented SmartGRID offers Japanese polymer tech with 2,500+ air channels and zero-sag spine support.',
        score: '96 / 100',
        feedback:
          'Excellent! Builds value through product differentiation, cooling comfort, and durability rather than just discounting.',
      },
      {
        id: 'opt-2',
        text: 'Immediately offer an unauthorized 30% discount coupon to undercut the competitor and close the sale right now.',
        score: '48 / 100',
        feedback:
          'Poor approach: Erodes brand equity and margins without explaining why SmartGRID technology is superior.',
      },
      {
        id: 'opt-3',
        text: 'Explain that mattresses affect back health for 8 hours daily, and offer an easy no-cost EMI plan (₹1,580/mo) to make the quality difference affordable.',
        score: '86 / 100',
        feedback:
          'Strong consultative response! Reframes cost as daily health investment and lowers the entry barrier with EMI.',
      },
    ],
  },
  {
    id: 'sc-2',
    tag: 'Product Comparison',
    title: 'Memory Foam vs Pocket Spring vs SmartGRID',
    customerName: 'Vikram D. (Simulated)',
    initials: 'VD',
    persona: 'Analytical buyer',
    prompt:
      '"I am confused between traditional memory foam, pocket spring, and your SmartGRID. How is the GRID actually different from standard memory foam?"',
    talkingPoints:
      'Explain hyper-elastic polymer grid mechanics: adapts dynamically to shoulders and hips without sinking or trapping heat, and isolates motion better than springs without squeaking or metal coils.',
    options: [
      {
        id: 'opt-1',
        text: 'Explain the core difference: Memory foam collapses and traps body heat, while pocket springs bounce; SmartGRID is hyper-elastic polymer that isolates motion, cushions pressure points, and stays cool.',
        score: '95 / 100',
        feedback:
          'Outstanding! Clear breakdown of material differences that directly addresses the customer\'s technical curiosity.',
      },
      {
        id: 'opt-2',
        text: 'Tell the customer that spring and memory foam are obsolete technologies and only SmartGRID is worth buying.',
        score: '52 / 100',
        feedback:
          'Too dismissive: Sounding condescending toward other materials can alienate customers who currently own them.',
      },
      {
        id: 'opt-3',
        text: 'Offer a personalized firmness recommendation based on their sleeping position (side/back) and explain how Ortho GRID aligns the spine.',
        score: '88 / 100',
        feedback:
          'Great consultative questioning! Connects product mechanics to the customer\'s personal sleep habits.',
      },
    ],
  },
  {
    id: 'sc-3',
    tag: 'Trial & Warranty',
    title: '100-Night Trial & Warranty Reassurance',
    customerName: 'Ananya M. (Simulated)',
    initials: 'AM',
    persona: 'Cautious first-time buyer',
    prompt:
      '"Buying a mattress online without lying on it first feels risky. What happens if I wake up with back stiffness after two weeks?"',
    talkingPoints:
      'Highlight our 100-night risk-free trial with hassle-free pickup and 100% refund, plus 10-year warranty against sagging (>1 inch). Mention that the body typically takes 2-3 weeks to adapt to orthopaedic support.',
    options: [
      {
        id: 'opt-1',
        text: 'Reassure them with our 100-Night Risk-Free Trial: test it at home, and if not completely satisfied, we provide 100% money back with free doorstep pickup, backed by a 10-year warranty.',
        score: '98 / 100',
        feedback:
          'Top tier! Direct, reassuring, and completely removes purchase risk with the 100-night trial.',
      },
      {
        id: 'opt-2',
        text: 'Assure them that nobody ever returns our mattresses because the SmartGRID is universally comfortable for everyone.',
        score: '45 / 100',
        feedback:
          'Overpromising: Avoid making unrealistic absolute claims; customers trust clear return and trial policies more.',
      },
      {
        id: 'opt-3',
        text: 'Explain the 3-week spine adjustment period and guide them through our warranty claim process and sleep specialist support line.',
        score: '85 / 100',
        feedback:
          'Thoughtful and educational! Sets realistic expectations for orthopaedic alignment.',
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
      {/* ── Navy Band ────────────────────────────────────────────────────── */}
      <div className="planner-top-band">
        <span className="planner-top-band__caption">Planner</span>
        <span className="planner-top-band__title">Today's calling plan</span>
      </div>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="practise-header">
        <div>
          <h1 className="practise-header__title">Practise a call</h1>
          <p className="practise-header__subtitle">
            Sharpen objection handling, product pitches, and sleep consultations in a simulated environment.
          </p>
        </div>
        <div className="practise-banner">
          <Lightbulb size={14} aria-hidden="true" />
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
