# On-Ground.ai Call Centre

A rebuild of the On-Ground.ai Call Centre app for The Sleep Company, frontend only, local sample data, no backend.

## Links

- **Live demo**: https://onground-call-centre-brown.vercel.app/
- **Repository**: https://github.com/aritray-das/Onground_Call_Centre
- **Screen recording**: https://drive.google.com/file/d/1sd58szYpX2pf2yk3pRyEJIJkybOJ3S70/view?usp=sharing

## How to Run

### Prerequisites
Node.js 20.19+ or Node.js 22+ (tested with Node v22.16.0).

### Commands
```bash
# Install dependencies
npm install

# Start local development server (http://localhost:5173)
npm run dev

# Run ESLint validation
npm run lint

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

## Stack and Why

| Technology | Purpose & Rationale |
| :--- | :--- |
| **React 19 + Vite** | React preferred for declarative UI and modular state; Vite delivers fast HMR and instant static bundle builds. |
| **Vanilla CSS** | Scoped component stylesheets (`*.css`) alongside design tokens in `src/index.css` for full control over typography, spacing, and micro-interactions without third-party CSS overhead. |
| **State-Based Navigation** | Component switching managed via top-level state in `AppShell` with no router dependency (tradeoff: browser refresh returns to the Dashboard). |
| **CSS Bar Charts** | Lightweight, 7-day volume and quality charts built with pure CSS and flexbox; eliminates external charting dependencies. |
| **Centralized Mock Data** | Single source of truth at `src/data/mockData.js` representing The Sleep Company's products, leads, metrics, and calendar. |

## What is Built

### Required Features
- **App Shell (`AppShell`, `Sidebar`, `TopBar`)**: Layout container Dark green sidebar with Dashboard, Plan (Calls to make, Incoming, Recent, Practise a call), Calendar and Pulse, plus a top bar.
- **Top Bar & Profile Menu (`TopBar`)**: Displays notification count (3), streak and points indicator (⚡ 1,240 pts · 7d), and an avatar button ("AR") that opens a right-aligned profile card with agent information (`Arvind Rajan`, `Koramangala · The Sleep Company`), divider, and interactive options ("Avatar", "Settings", "Logout" in red). Selecting an item triggers a 2.5-second feedback toast at the bottom of the screen; handles outside clicks and the Escape key.
- **Dashboard (`Dashboard`)**: Greeting banner ("Good evening, Arvind Rajan · The Sleep Company · Call Centre"), tight 4-KPI strip (76 calls, 4m 12s, 34%, 2), a green "MY PROGRESS · TODAY" card (3 Leads created, 2 Leads called), "Who's waiting" queue with colored time chips and an "Open planner" link, "My earnings this month" target tracker (₹5,200 / ₹10,000), dark brown/amber "My Tasks" card with task count badge and a clickable "2 hot leads" row, and two 7-day CSS bar charts with values above each bar and current-day highlights.
- **Planned Outgoing Calls (`CallsToMake`)**: Top navy band ("Planner · Today's calling plan"), pagination (5 calls per page), intent score badges, expandable customer rows with rotating chevron indicators, and simulated action buttons ("Call", "Log outcome") with 3-second status messages.
- **Incoming Calls (`Incoming`)**: Top navy band, page heading ranked by expected value descending, light summary strip ("5 MISSED TODAY" · "₹81,860 EXPECTED VALUE AT STAKE"), expected value displayed above a green "Call back" button, and simulated callback feedback ("Demo: No call placed").
- **Recent Calls (`Recent`)**: Top navy band, call history list with expandable detail cards for reviewing call duration, outcome tags, and agent notes.
- **Calendar (`Calendar`)**: Info banner, October 2026 month grid with navigation controls ("Prev", "Today", "Next") placed in the card header next to the month title, today cell (Oct 9) highlighted with a blue outline, event dots, and a day-detail inspector on the right.
- **Pulse Home (`PulseHome`)**: Purple header with search input, AvaniBot card with "AGENTS ON" tag and demo response buttons ("Daily Brief", "Ask a question"), categorized agent lists (Custom Agents, Role Agents, Task Agents with percentage badges, General discussions), and an amber Kudos card with a "NEW" tag.
- **Pulse Channel & Chat (`PulseChannel`)**: `#callcentre-team` channel with purple header and back navigation; pinned "Needs your input" card for confirming or rescheduling Priya Iyer's 4:30pm callback (answering via button or typed text resolves the card, clears the badge, and appends a response bubble from "You"); active conversation thread with Sunita Rao and "You"; functional chat input with auto-scrolling.
- **Hot Leads Inspection Modal (`LeadsModal`)**: Accessible modal paging through 5 hot leads; displays progress dots, "Quote to be given to customer" strip, ICP Fit percentage bar, Lead Intent Score, and 3 collapsible sections open by default (ICP Fit Breakdown, How We Got Here, and Where We Picked Up Signals with financing, quotation, and warranty details); footer displays cumulative missed attempts with a manager warning badge.

### Bonus Features
- **Send Channel Messages**: Functional message input in `#callcentre-team` with auto-scrolling and timestamp formatting.
- **Needs-Your-Input Flow**: Interactive resolution flow for the pinned task card with visual feedback and dynamic state updates.
- **Practise a Call Simulator (`Practise`)**: Dedicated practice simulator with 3 interactive sales scenarios for The Sleep Company (price objection, foam vs spring vs SmartGRID comparison, 100-night trial reassurance); 3 rebuttal options per scenario with immediate scoring (e.g., 96 / 100), coaching feedback, and an expandable talking-points accordion.
- **Simulated Callback Actions**: Non-blocking simulated feedback triggers across outgoing, incoming, and recent call views without pretending to dial real phone numbers.
- **Mobile Responsive Drawer Layout**: TopBar hamburger button controls a sliding drawer on screens under 768px with touch-friendly backdrop dismissal.

## What I Skipped or Simplified

- **No Chart Library**: Bar charts are rendered with plain CSS and flexbox percentages rather than external dependencies like Recharts or Chart.js.
- **No URL Routing**: Section navigation is managed in component state via `activeId`; refreshing the browser returns to the Dashboard.
- **Session-Only State**: Newly sent Pulse messages, resolved task card states, and modal page index reset upon full page refresh.
- **No External Telephony / Dialers**: "Call back" and "Call" buttons demonstrate local workflow feedback; no external calling service or WebRTC connection is attached.
- **Sample Calendar Only**: Calendar events are fixed for October 2026 and do not integrate with Google Calendar or Outlook APIs.
- **Decorative Elements Omitted**: The floating dial button and the DEMO strip were not built, because the brief marks them optional.
- **Static top-bar values**: the notification count, points and streak do not change with activity.

## Project Structure

```
src/
├── App.jsx                     # Top-level application component mounting AppShell
├── index.css                   # Global CSS design tokens (colors, typography, spacing) and resets
├── main.jsx                    # React entry point mounting App to DOM
├── components/
│   ├── calendar/
│   │   ├── Calendar.jsx        # October 2026 interactive scheduling grid and event detail panel
│   │   └── Calendar.css        # Scoped styles for Calendar
│   ├── dashboard/
│   │   ├── Dashboard.jsx       # Overview screen: KPIs, progress, waitlist, tasks, and 7-day charts
│   │   └── Dashboard.css       # Scoped styles for Dashboard
│   ├── layout/
│   │   ├── AppShell.jsx        # Root application layout managing active page state and mobile drawer
│   │   ├── AppShell.css        # Scoped styles for AppShell
│   │   ├── Sidebar.jsx         # Left navigation sidebar with category sections and badge counts
│   │   ├── Sidebar.css         # Scoped styles for Sidebar
│   │   ├── TopBar.jsx          # Top application bar with streak, points, notifications, and profile menu
│   │   └── TopBar.css          # Scoped styles for TopBar and dropdown
│   ├── leads/
│   │   ├── LeadsModal.jsx      # Modal inspecting 5 hot leads with paging, signals, and ICP breakdown
│   │   └── LeadsModal.css      # Scoped styles for LeadsModal
│   ├── plan/
│   │   ├── CallsToMake.jsx     # Outgoing call planner with priority scoring, paging, and expansion
│   │   ├── CallsToMake.css     # Scoped styles for CallsToMake
│   │   ├── Incoming.jsx        # Missed calls list ranked by expected monetary value
│   │   ├── Incoming.css        # Scoped styles for Incoming
│   │   ├── Practise.jsx        # Objection handling simulator with 3 mattress sales scenarios and scoring
│   │   ├── Practise.css        # Scoped styles for Practise
│   │   ├── Recent.jsx          # Call history with expandable call review and outcome tags
│   │   └── Recent.css          # Scoped styles for Recent
│   └── pulse/
│       ├── PulseHome.jsx       # Knowledge & agent directory with AvaniBot card and categorized channels
│       ├── PulseHome.css       # Scoped styles for PulseHome
│       ├── PulseChannel.jsx    # #callcentre-team channel with pinned callback resolution card and chat
│       └── PulseChannel.css    # Scoped styles for PulseChannel
├── data/
│   └── mockData.js             # Centralized local mock data for agent, leads, calls, charts, and pulse
└── utils/
    └── format.js               # Currency formatting utility (INR format)
```

## AI Tools Used

Google Antigravity (Gemini agent): scaffolding, component drafts, applying design changes. Claude: planning against the assignment PDF, drafting the prompts given to Antigravity, reviewing progress, and drafting this README. I ran lint and build after each step, checked each screen against the PDF screenshots, and committed step by step.

## Note on the Mock

I viewed the mock in the browser to see hover, click and scroll behaviour. I did not save, copy or inspect its source code; all code in this repository is my own. Sample names and numbers (leads, missed calls, earnings) come from what the assignment PDF shows. Everything else is my own sample data.

## Verification

- **Lint (`npm run lint`)**: Passed with 0 errors and 0 warnings.
- **Build (`npm run build`)**: Vite production bundle compiled cleanly in under 500ms with 0 errors.
