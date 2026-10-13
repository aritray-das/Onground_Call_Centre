# On-Ground.ai Call Centre

A high-fidelity rebuild of the On-Ground.ai Call Centre app for The Sleep Company, featuring real Twilio WebRTC browser telephony, interactive AI voice customer simulation, Lucide iconography, and centralized sample data.

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

### Environment Configuration (Optional — For Real Voice Telephony)
To test real WebRTC voice dialing and the AI customer simulator locally or on Vercel, create a `.env.local` file with the following variables:

```ini
# Twilio Account & Voice SDK Credentials
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_API_KEY_SID=SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_API_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_TWIML_APP_SID=APxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_CALLER_ID=+1xxxxxxxxxx

# Security & Dialing Permissions
DEMO_PASSCODE=your_secret_demo_passcode
DEMO_ALLOWED_NUMBERS=+91xxxxxxxxxx,+1xxxxxxxxxx

# Optional: Force all outbound PSTN calls to a specific test phone
# DEMO_ROUTE_TO=+91xxxxxxxxxx
```

*Note: The frontend operates fully without Twilio credentials. When credentials are provided, the floating Call Panel connects directly to Twilio Voice.*

---

## Stack and Why

| Technology | Purpose & Rationale |
| :--- | :--- |
| **React 19 + Vite** | React for declarative UI and modular state; Vite delivers rapid HMR and lightweight production builds. |
| **Vanilla CSS** | Scoped component stylesheets (`*.css`) alongside design tokens in `src/index.css` for full control over typography, spacing, and micro-interactions without third-party CSS overhead. |
| **Twilio Voice SDK (`@twilio/voice-sdk`)** | WebRTC-based browser telephony enabling live outbound dialing, two-way audio, microphone mute toggling, DTMF tone sending, and call status lifecycle management. |
| **Vercel Serverless Functions (`/api`)** | Lightweight Node.js serverless endpoints issuing short-lived HMAC-signed Twilio Access Tokens (`/api/token`) and serving dynamic TwiML response trees (`/api/voice`). |
| **Lucide Icons (`lucide-react`)** | Crisp, scalable SVG icon set replacing raw emojis and character entities across the sidebar, navigation, metrics, buttons, and call actions. |
| **Amazon Polly Neural Voice (`Polly.Aditi`) + Speech Recognition** | Interactive Indian English conversational voice agent powered by Twilio `<Gather input="speech">` allowing realistic spoken sales practice without telecom carrier restrictions. |
| **CSS Bar Charts** | Lightweight 7-day volume and quality charts built with pure CSS and flexbox; eliminates external charting bundle size. |
| **Centralized Mock Data** | Single source of truth at `src/data/mockData.js` representing The Sleep Company's products, leads, metrics, and calendar. |

---

## What is Built

### 1. App Shell & Navigation
- **Sidebar (`Sidebar.jsx`)**: Dark green sidebar with brand header and navigation items equipped with dedicated Lucide icons:
  - **Dashboard**: `LayoutDashboard`
  - **Plan**: `PhoneCall` with collapsible accordion chevron `ChevronRight`
    - **Calls to make**: `PhoneOutgoing`
    - **Incoming**: `PhoneIncoming`
    - **Recent**: `Clock`
    - **Practise a call**: `Headphones`
  - **Calendar**: `Calendar`
  - **Pulse**: `Activity`
- **Mobile Responsive Drawer**: TopBar hamburger button (`Menu`) controls a sliding drawer on screens under 768px with touch backdrop dismissal.
- **Top Bar & Profile Menu (`TopBar.jsx`)**: Displays notification badge (`Bell`), streak indicator (`Zap`), and an avatar button ("AR") opening a right-aligned profile card (`Arvind Rajan`, `Koramangala · The Sleep Company`) with interactive options (`Settings`, `LogOut`) triggering bottom toast notifications.

### 2. Live In-App Telephony & AI Voice Customer
- **Floating Call Widget (`CallPanel.jsx`, `useTwilioCall.js`)**:
  - Global floating action button (FAB) with animated pulse indicator when a call is active.
  - In-browser WebRTC audio connection via `@twilio/voice-sdk`.
  - Passcode-authenticated token generation via `/api/token`.
  - Active call timer, microphone mute/unmute toggle (`Mic` / `MicOff`), and hangup action (`PhoneOff`).
  - **Twilio Trial DTMF Auto-Bypass**: Automatically transmits DTMF tone `1` upon connection and provides a dedicated `Press 1` (`Hash`) button to immediately dismiss Twilio trial account prompts.
  - **Interactive AI Customer Persona (`AI-Customer`)**: Preset one-click dialer button connecting to an interactive Amazon Polly (`Polly.Aditi`) voice customer. Uses `<Gather input="speech">` to conduct multi-turn spoken dialogue about On-Ground.ai and The Sleep Company sales workflows.
  - **Global Call Integration**: Clicking "Call" or "Call back" anywhere in the Planner, Incoming, or Recent lists auto-populates the customer's phone number into the dialer.

### 3. Core Pages & Workflows
- **Dashboard (`Dashboard.jsx`)**: Greeting banner ("Good evening, Arvind Rajan · The Sleep Company · Call Centre"), tight 4-KPI strip (76 calls, 4m 12s, 34%, 2), "MY PROGRESS · TODAY" tracker, "Who's waiting" queue with time chips, monthly earnings tracker (₹5,200 / ₹10,000), dark amber "My Tasks" card with clickable hot leads row, and two 7-day CSS bar charts with current-day highlights.
- **Planned Outgoing Calls (`CallsToMake.jsx`)**: Today's calling plan with priority intent scores, expandable customer cards with chevron indicators, pagination controls, and direct "Start Call" buttons linking to the dialer.
- **Incoming Missed Calls (`Incoming.jsx`)**: Ranked by expected monetary value descending with summary strip ("5 MISSED TODAY" · "₹81,860 EXPECTED VALUE AT STAKE") and quick "Call back" action buttons.
- **Recent Calls History (`Recent.jsx`)**: Call logs with duration, outcome badges, agent notes, and instant redial triggers.
- **Calendar (`Calendar.jsx`)**: October 2026 interactive month grid with navigation controls (`ChevronLeft` / `ChevronRight`), current-day highlight, event indicators, and day inspector panel.
- **Hot Leads Inspection Modal (`LeadsModal.jsx`)**: 5 hot leads modal with progress paging, quote strip, ICP Fit percentage bar, Lead Intent Score, and collapsible breakdown sections (Financing, Quotation, Warranty signals) with manager warning badge.
- **Pulse Community & AI Directory (`PulseHome.jsx`, `PulseChannel.jsx`)**: AvaniBot assistant card, kudos leaderboard, `#callcentre-team` channel with pinned callback resolution card, active thread conversation, and auto-scrolling chat composer.
- **Practise a Call Simulator (`Practise.jsx`)**: 3 interactive sales scenarios for The Sleep Company (price objection, SmartGRID vs foam comparison, 100-night trial reassurance) with instant scoring (e.g., 96 / 100), coaching feedback, and talking points accordion.

---

## Technical Notes & Telecom Considerations

- **Indian Carrier (PSTN) Regulations**: Twilio Free Trial accounts forbid bridging outbound calls to Indian PSTN phone numbers (`+91`) without an upgraded Twilio project and local regulatory (TRAI) enterprise verification.
- **Voice Testing Solution**: To ensure full voice review without telephony billing barriers, the application includes the **AI Customer Persona (`AI-Customer`)**, which routes over pure browser WebRTC through Amazon Polly neural voice and Twilio speech recognition `<Gather>`, delivering two-way verbal dialogue.
- **Twilio Trial DTMF Prompt**: On Twilio trial accounts, Twilio injects a mandatory verbal prompt ("Press any key to execute your code"). The client app auto-sends DTMF `1` via `call.sendDigits('1')` upon connection and provides a manual `Press 1` button in `CallPanel.jsx`.
- **CSS Bar Charts**: Volume and quality charts are rendered with pure CSS flexbox percentages, keeping bundle size minimal and zero-dependency.
- **State-Based Navigation**: Section routing is managed in component state via `activeId` in `AppShell` with clean separation of concerns.

---

## Project Structure

```
├── api/
│   ├── token.js                # Vercel serverless function: issues Twilio Voice Access Tokens
│   └── voice.js                # Vercel serverless function: TwiML webhook (AI customer & PSTN dialer)
├── src/
│   ├── App.jsx                 # Top-level application component mounting AppShell
│   ├── index.css               # Design tokens (colors, typography, spacing) and resets
│   ├── main.jsx                # React entry point mounting App to DOM
│   ├── components/
│   │   ├── calendar/
│   │   │   ├── Calendar.jsx    # October 2026 scheduling grid and event detail panel
│   │   │   └── Calendar.css    # Scoped styles for Calendar
│   │   ├── calling/
│   │   │   ├── CallPanel.jsx   # Floating WebRTC phone dialer and active call controller
│   │   │   └── CallPanel.css   # Scoped styles for CallPanel widget
│   │   ├── dashboard/
│   │   │   ├── Dashboard.jsx   # Overview screen: KPIs, progress, waitlist, tasks, and charts
│   │   │   └── Dashboard.css   # Scoped styles for Dashboard
│   │   ├── layout/
│   │   │   ├── AppShell.jsx    # Root application layout managing active page state
│   │   │   ├── AppShell.css    # Scoped styles for AppShell
│   │   │   ├── Sidebar.jsx     # Navigation sidebar with Lucide icons and category accordion
│   │   │   ├── Sidebar.css     # Scoped styles for Sidebar
│   │   │   ├── TopBar.jsx      # Top application bar with streak, notifications, and profile menu
│   │   │   └── TopBar.css      # Scoped styles for TopBar
│   │   ├── leads/
│   │   │   ├── LeadsModal.jsx  # Modal inspecting 5 hot leads with ICP breakdown and signals
│   │   │   └── LeadsModal.css  # Scoped styles for LeadsModal
│   │   ├── plan/
│   │   │   ├── CallsToMake.jsx # Outgoing call planner with priority scoring and dialer trigger
│   │   │   ├── CallsToMake.css # Scoped styles for CallsToMake
│   │   │   ├── Incoming.jsx    # Missed calls list ranked by expected monetary value
│   │   │   ├── Incoming.css    # Scoped styles for Incoming
│   │   │   ├── Practise.jsx    # Objection handling simulator with mattress sales scenarios
│   │   │   ├── Practise.css    # Scoped styles for Practise
│   │   │   ├── Recent.jsx      # Call history with expandable review and outcome tags
│   │   │   └── Recent.css      # Scoped styles for Recent
│   │   └── pulse/
│   │       ├── PulseHome.jsx   # Knowledge & agent directory with AvaniBot card
│   │       ├── PulseHome.css   # Scoped styles for PulseHome
│   │       ├── PulseChannel.jsx# #callcentre-team channel with task card and chat thread
│   │       └── PulseChannel.css# Scoped styles for PulseChannel
│   ├── data/
│   │   └── mockData.js         # Centralized mock data for agent, leads, calls, charts, and pulse
│   ├── hooks/
│   │   └── useTwilioCall.js    # Custom React hook for Twilio Device and WebRTC call lifecycle
│   └── utils/
│       └── format.js           # Currency formatting utility (INR format)
├── package.json
└── README.md
```

---

## AI Tools Used

Google Antigravity (Gemini agent): scaffolding, component drafts, applying design changes, Twilio Voice SDK integration, serverless function implementation, and Lucide icon migration. Claude: planning against the assignment requirements, reviewing progress, and drafting documentation. Lint and build checks were run after each step.

---

## Note on the Mock

I viewed the mock in the browser to examine hover, click, and scroll behaviour. I did not save, copy, or inspect its source code; all code in this repository is original. Sample names and metrics (leads, missed calls, earnings) reflect what the assignment displays. All other information is custom sample data.

---

## Verification

- **Lint (`npm run lint`)**: Passed with 0 errors and 0 warnings.
- **Build (`npm run build`)**: Vite production bundle compiled cleanly in under 1.6s with 0 errors.
