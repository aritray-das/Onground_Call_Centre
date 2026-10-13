/**
 * src/data/mockData.js
 *
 * Centralized mock data for the On-Ground.ai Call Centre App.
 * All data is static — no API calls, no backend, no runtime generation.
 *
 * Sections (exports):
 *   1.  AGENT            — logged-in agent profile
 *   2.  DASHBOARD_KPI    — four headline KPI cards
 *   3.  TODAY_PROGRESS   — today's call-count progress
 *   4.  PEOPLE_WAITING   — queue of contacts waiting for a call
 *   5.  EARNINGS         — today's earnings summary
 *   6.  TASKS            — callback, hot-lead, and outcome counts
 *   7.  CHART_CALL_VOLUME    — 7-day outbound call volume (Mon–Sun)
 *   8.  CHART_CALL_QUALITY   — 7-day call-quality scores (Mon–Sun)
 *   9.  CALLS_TO_MAKE    — planned outbound call list
 *   10. INCOMING_CALLS   — missed incoming call records
 *   11. INCOMING_SUMMARY — aggregate stats for incoming tab
 *   12. RECENT_CALLS     — completed/recent call records
 *   13. CALENDAR_META    — October 2026 calendar metadata
 *   14. CALENDAR_EVENTS  — scheduled items for October 2026
 *   15. PULSE_AGENT      — Pulse: current agent card
 *   16. PULSE_CUSTOM_AGENTS  — Pulse: custom (AI-persona) agents
 *   17. PULSE_ROLE_AGENTS    — Pulse: role-based agents
 *   18. PULSE_TASK_AGENTS    — Pulse: task-specific agents
 *   19. PULSE_CHANNEL    — Pulse: channel / team chat metadata
 *   20. PULSE_CHAT       — Pulse: pinned item + chat messages
 *   21. PULSE_KUDOS      — Pulse: Kudos card content
 *   22. LEADS            — lead pipeline records
 */

/* ============================================================
   1. AGENT — logged-in agent profile
   ============================================================ */
export const AGENT = {
  name: 'Arvind Rajan',
  initials: 'AR',
  location: 'Koramangala',
  role: 'The Sleep Company',
  greeting: 'Good evening',   // static; swap for dynamic greeting in the UI layer
  team: 'Call Centre',
  level: 7,
  avatarColor: '#236b4e',     // matches --color-green-600
}

/* ============================================================
   2. DASHBOARD_KPI — four headline KPI cards
   Numbers are raw values; format (%, duration strings, etc.) in the UI.
   ============================================================ */
export const DASHBOARD_KPI = [
  {
    id: 'calls-completed',
    label: 'Calls Completed',
    value: 76,
    unit: null,          // plain count
    trend: '+4',
    trendDirection: 'up',
  },
  {
    id: 'avg-call-duration',
    label: 'Avg. Call Duration',
    value: 252,          // seconds → 4m 12s; format in UI
    displayValue: '4m 12s',
    unit: 'seconds',
    trend: '-18s',
    trendDirection: 'down',
  },
  {
    id: 'conversion-rate',
    label: 'Conversion Rate',
    value: 34,           // percentage
    unit: '%',
    trend: '+2%',
    trendDirection: 'up',
  },
  {
    id: 'escalations',
    label: 'Escalations',
    value: 2,
    unit: null,
    trend: '-1',
    trendDirection: 'down',
  },
]

/* ============================================================
   3. TODAY_PROGRESS — today's call-count progress bar data
   ============================================================ */
export const TODAY_PROGRESS = {
  completed: 76,
  target: 100,
  label: "Today's Calls",
}

/* ============================================================
   4. PEOPLE_WAITING — contacts in the callback / waiting queue
   ============================================================ */
export const PEOPLE_WAITING = [
  {
    id: 'pw-1',
    name: 'Priya Iyer',
    initials: 'PI',
    note: 'Requested callback on Ortho GRID mattress — very interested, asked about EMI options.',
    timeLabel: '12 min ago',
    priority: 'high',
    product: 'Ortho GRID Mattress',
    expectedValue: 18000,
  },
  {
    id: 'pw-2',
    name: 'Suresh Nair',
    initials: 'SN',
    note: 'Follow-up on Smart GRID mattress quote. Comparing with competitor. Needs reassurance on 100-night trial.',
    timeLabel: '28 min ago',
    priority: 'medium',
    product: 'Smart GRID Mattress',
    expectedValue: 12500,
  },
  {
    id: 'pw-3',
    name: 'Ananya Mehta',
    initials: 'AM',
    note: 'Missed first call. Left voicemail. Interested in King size bed frame & mattress bundle.',
    timeLabel: '45 min ago',
    priority: 'medium',
    product: 'Bed Frame & Bundle',
    expectedValue: 22000,
  },
  {
    id: 'pw-4',
    name: 'Vikram Desai',
    initials: 'VD',
    note: 'Asked about ergonomic back support. Wants to compare SmartGRID vs memory foam.',
    timeLabel: '1h 10m ago',
    priority: 'low',
    product: 'Smart GRID Luxe',
    expectedValue: 50000,
  },
]

/* ============================================================
   5. EARNINGS — today's earnings summary
   All monetary values in INR (₹), stored as plain numbers.
   ============================================================ */
export const EARNINGS = {
  earned: 5200,          // ₹5,200 earned today
  queued: 1750,          // ₹1,750 from queued/pending work
  target: 10000,         // ₹10,000 daily target
  currency: 'INR',
  currencySymbol: '₹',
}

/* ============================================================
   6. TASKS — callback, hot-lead, and outcome counts
   ============================================================ */
export const TASKS = {
  callbacks: 2,
  hotLeads: 2,
  outcomes: 1,
}

/* ============================================================
   7. CHART_CALL_VOLUME — 7-day outbound call volume (Mon–Sun)
   Each entry: day label + number of calls made.
   ============================================================ */
export const CHART_CALL_VOLUME = [
  { day: 'Mon', calls: 58 },
  { day: 'Tue', calls: 72 },
  { day: 'Wed', calls: 65 },
  { day: 'Thu', calls: 80 },
  { day: 'Fri', calls: 76 },
  { day: 'Sat', calls: 45 },
  { day: 'Sun', calls: 30 },
]

/* ============================================================
   8. CHART_CALL_QUALITY — 7-day call-quality scores (Mon–Sun)
   Score is a 0–100 index based on duration, outcome, and feedback.
   ============================================================ */
export const CHART_CALL_QUALITY = [
  { day: 'Mon', score: 72 },
  { day: 'Tue', score: 78 },
  { day: 'Wed', score: 74 },
  { day: 'Thu', score: 82 },
  { day: 'Fri', score: 80 },
  { day: 'Sat', score: 68 },
  { day: 'Sun', score: 61 },
]

/* ============================================================
   9. CALLS_TO_MAKE — planned outbound call list
   At least 10 records to support pagination (5 per page, 2 pages).
   Fields:
     id, name, initials, interest, product, value (INR),
     score (lead intent 0–100), status, timeSlot, isHot
   ============================================================ */
export const CALLS_TO_MAKE = [
  {
    id: 'ctm-1',
    name: 'Priya Iyer',
    initials: 'PI',
    phone: '+919800020001',
    interest: 'Interested in Ortho GRID Mattress — looking for orthopedic spine support',
    product: 'Ortho GRID Mattress',
    value: 18000,
    score: 87,
    status: 'pending',
    timeSlot: '2:00 PM',
    isHot: true,
  },
  {
    id: 'ctm-2',
    name: 'Suresh Nair',
    initials: 'SN',
    phone: '+919800020002',
    interest: 'Comparing Smart GRID mattress options; 100-night trial terms are priority',
    product: 'Smart GRID Mattress',
    value: 12500,
    score: 74,
    status: 'pending',
    timeSlot: '2:30 PM',
    isHot: false,
  },
  {
    id: 'ctm-3',
    name: 'Divya Pillai',
    initials: 'DP',
    phone: '+919800020003',
    interest: 'Bed frame & mattress combo upgrade — existing customer, upsell opportunity',
    product: 'Smart Bed Frame',
    value: 22000,
    score: 91,
    status: 'pending',
    timeSlot: '3:00 PM',
    isHot: true,
  },
  {
    id: 'ctm-4',
    name: 'Arjun Krishnan',
    initials: 'AK',
    phone: '+919800020004',
    interest: 'New to ergonomic sleep; first-time buyer exploring SmartGRID pillow set',
    product: 'SmartGRID Pillow Set',
    value: 9800,
    score: 62,
    status: 'pending',
    timeSlot: '3:30 PM',
    isHot: false,
  },
  {
    id: 'ctm-5',
    name: 'Meena Sundaram',
    initials: 'MS',
    phone: '+919800020005',
    interest: 'Smart GRID Luxe comparison — interested in 10-year warranty cover',
    product: 'Smart GRID Luxe',
    value: 50000,
    score: 70,
    status: 'pending',
    timeSlot: '4:00 PM',
    isHot: false,
  },
  {
    id: 'ctm-6',
    name: 'Rajan Pillai',
    initials: 'RP',
    phone: '+919800020006',
    interest: 'Senior citizen ortho comfort — looking for firm lumbar support and delivery in Chennai',
    product: 'Ortho GRID King',
    value: 16500,
    score: 80,
    status: 'pending',
    timeSlot: '4:30 PM',
    isHot: false,
  },
  {
    id: 'ctm-7',
    name: 'Kavitha Rao',
    initials: 'KR',
    phone: '+919800020007',
    interest: 'Store trial completed — wants to order ergonomic motorized recliner bed',
    product: 'Recliner Bed Frame',
    value: 35000,
    score: 76,
    status: 'scheduled',
    timeSlot: '5:00 PM',
    isHot: false,
  },
  {
    id: 'ctm-8',
    name: 'Harish Bose',
    initials: 'HB',
    phone: '+919800020008',
    interest: 'Waterproof mattress protector & pillow pair add-on inquiry for existing order',
    product: 'Protector & Pillows',
    value: 8200,
    score: 65,
    status: 'scheduled',
    timeSlot: '5:30 PM',
    isHot: false,
  },
  {
    id: 'ctm-9',
    name: 'Nisha Kapoor',
    initials: 'NK',
    phone: '+919800020009',
    interest: 'Asked about cooling snow gel layer add-on for existing Smart GRID mattress',
    product: 'Cooling Mattress',
    value: 14200,
    score: 72,
    status: 'pending',
    timeSlot: '6:00 PM',
    isHot: false,
  },
  {
    id: 'ctm-10',
    name: 'Sameer Ghosh',
    initials: 'SG',
    phone: '+919800020010',
    interest: 'Interested in kids posture mattress — son turning 5 next year',
    product: 'Kids Ortho Mattress',
    value: 42000,
    score: 68,
    status: 'scheduled',
    timeSlot: '6:30 PM',
    isHot: false,
  },
]

/* ============================================================
   10. INCOMING_CALLS — missed incoming call records
   Five specific records as required by the assignment.
   Fields:
     id, callerName, initials, time, context, expectedValue (INR),
     callbackScheduled
   ============================================================ */
export const INCOMING_CALLS = [
  {
    id: 'ic-1',
    callerName: 'Faizan A.',
    initials: 'FA',
    phone: '+919800010001',
    time: '1:42 PM',
    context: 'Called twice — likely following up on Ortho GRID mattress quote sent last week.',
    expectedValue: 24000,
    callbackScheduled: false,
  },
  {
    id: 'ic-2',
    callerName: 'Kavitha R.',
    initials: 'KR',
    phone: '+919800010002',
    time: '1:15 PM',
    context: 'Existing customer — may be calling about delivery scheduling or order confirmation.',
    expectedValue: 16500,
    callbackScheduled: true,
  },
  {
    id: 'ic-3',
    callerName: 'Divya P.',
    initials: 'DP',
    phone: '+919800010003',
    time: '12:58 PM',
    context: 'New lead — expressed interest in Smart GRID bundle online, now calling for details.',
    expectedValue: 22000,
    callbackScheduled: false,
  },
  {
    id: 'ic-4',
    callerName: 'Riku S.',
    initials: 'RS',
    phone: '+919800010004',
    time: '11:30 AM',
    context: 'Short call — dropped before connecting. Unknown intent.',
    expectedValue: 9360,
    callbackScheduled: false,
  },
  {
    id: 'ic-5',
    callerName: 'Unknown',
    initials: '?',
    phone: '+919800010005',
    time: '10:05 AM',
    context: 'No caller ID. May be a cold inquiry or misdial.',
    expectedValue: 10000,
    callbackScheduled: false,
  },
]

/* ============================================================
   11. INCOMING_SUMMARY — aggregate stats shown above incoming list
   ============================================================ */
export const INCOMING_SUMMARY = {
  missedToday: 5,
  expectedValue: 81860,    // sum of all INCOMING_CALLS expectedValue
  currency: 'INR',
  currencySymbol: '₹',
}

/* ============================================================
   12. RECENT_CALLS — completed / recent call records
   callType: 'outbound' | 'inbound' | 'missed'
   outcome:  'converted' | 'follow-up' | 'not-interested' | 'no-answer' | 'voicemail'
   ============================================================ */
export const RECENT_CALLS = [
  {
    id: 'rc-1',
    callerName: 'Mukunda R.',
    initials: 'MR',
    phone: '+919800030001',
    callType: 'outbound',
    dateTimeLabel: 'Today, 1:10 PM',
    duration: '5m 34s',
    outcome: 'converted',
    outcomeLabel: 'Converted',
    context: 'Closed Ortho GRID mattress ₹9,490 order. Customer satisfied with EMI breakdown.',
  },
  {
    id: 'rc-2',
    callerName: 'Kavitha R.',
    initials: 'KR',
    phone: '+919800030002',
    callType: 'inbound',
    dateTimeLabel: 'Today, 1:15 PM',
    duration: '2m 12s',
    outcome: 'follow-up',
    outcomeLabel: 'Follow-up set',
    context: 'Order delivery inquiry. Scheduled follow-up call for tomorrow 11 AM.',
  },
  {
    id: 'rc-3',
    callerName: 'Unknown',
    initials: '?',
    phone: '+919800030003',
    callType: 'missed',
    dateTimeLabel: 'Today, 10:05 AM',
    duration: '—',
    outcome: 'no-answer',
    outcomeLabel: 'No answer',
    context: 'No caller ID. Call disconnected before agent could answer.',
  },
  {
    id: 'rc-4',
    callerName: 'Riku S.',
    initials: 'RS',
    phone: '+919800030004',
    callType: 'missed',
    dateTimeLabel: 'Today, 11:30 AM',
    duration: '—',
    outcome: 'voicemail',
    outcomeLabel: 'Voicemail left',
    context: 'Short drop — left a voicemail requesting a callback.',
  },
  {
    id: 'rc-5',
    callerName: 'Faizan A.',
    initials: 'FA',
    phone: '+919800030005',
    callType: 'outbound',
    dateTimeLabel: 'Yesterday, 4:50 PM',
    duration: '7m 01s',
    outcome: 'not-interested',
    outcomeLabel: 'Not interested',
    context: 'Discussed Smart GRID Mattress. Customer declined — already bought elsewhere.',
  },
  {
    id: 'rc-6',
    callerName: 'Divya P.',
    initials: 'DP',
    phone: '+919800030006',
    callType: 'inbound',
    dateTimeLabel: 'Yesterday, 3:22 PM',
    duration: '3m 45s',
    outcome: 'follow-up',
    outcomeLabel: 'Follow-up set',
    context: 'New inquiry on bed frame & mattress bundle. Shared catalog. Scheduled callback for Mon.',
  },
]

/* ============================================================
   13. CALENDAR_META — October 2026 calendar metadata
   Explicit dates; does not depend on the computer's current date.
   ============================================================ */
export const CALENDAR_META = {
  year: 2026,
  month: 10,         // October (1-indexed)
  monthName: 'October',
  firstDayOfWeek: 4, // Thursday (0 = Sunday … 6 = Saturday)
  totalDays: 31,
  // highlighted date per the written reference description
  highlightedDate: 9,
}

/* ============================================================
   14. CALENDAR_EVENTS — scheduled items for October 2026
   All times in IST (India Standard Time, UTC+5:30).
   eventType: 'call' | 'meeting' | 'training' | 'review'
   ============================================================ */
export const CALENDAR_EVENTS = [
  {
    id: 'ce-1',
    date: '2026-10-10',
    time: '10:00 AM',
    title: 'Team Standup',
    eventType: 'meeting',
    description: 'Daily sync with Bangalore North team.',
    durationMinutes: 15,
  },
  {
    id: 'ce-2',
    date: '2026-10-10',
    time: '2:00 PM',
    title: 'Outbound Blitz',
    eventType: 'call',
    description: 'Focused 2-hour calling session — priority leads.',
    durationMinutes: 120,
  },
  {
    id: 'ce-3',
    date: '2026-10-10',
    time: '4:30 PM',
    title: 'Callback — Priya Iyer',
    eventType: 'call',
    description: 'Confirm Ortho GRID interest. Bring EMI options PDF.',
    durationMinutes: 20,
  },
  {
    id: 'ce-4',
    date: '2026-10-13',
    time: '11:00 AM',
    title: 'Callback — Kavitha R.',
    eventType: 'call',
    description: 'Order delivery discussion. Follow up from 10 Oct inbound.',
    durationMinutes: 15,
  },
  {
    id: 'ce-5',
    date: '2026-10-14',
    time: '3:00 PM',
    title: 'Product Training — SmartGRID Tech',
    eventType: 'training',
    description: 'Refresher on SmartGRID patented polymer features and objection handling.',
    durationMinutes: 60,
  },
  {
    id: 'ce-6',
    date: '2026-10-15',
    time: '10:30 AM',
    title: 'Callback — Divya P.',
    eventType: 'call',
    description: 'Mattress bundle follow-up. Share catalog before call.',
    durationMinutes: 20,
  },
  {
    id: 'ce-7',
    date: '2026-10-17',
    time: '2:00 PM',
    title: 'Monthly Performance Review',
    eventType: 'review',
    description: 'One-on-one with Team Lead. Bring October KPIs.',
    durationMinutes: 30,
  },
  {
    id: 'ce-8',
    date: '2026-10-21',
    time: '11:00 AM',
    title: 'Outbound Blitz',
    eventType: 'call',
    description: 'Target: 20+ calls. Focus on mattress and bedding leads.',
    durationMinutes: 120,
  },
  {
    id: 'ce-9',
    date: '2026-10-28',
    time: '10:00 AM',
    title: 'Team Standup',
    eventType: 'meeting',
    description: 'End-of-month review prep and pipeline check.',
    durationMinutes: 15,
  },
]

/* ============================================================
   15. PULSE_AGENT — logged-in agent's Pulse card
   ============================================================ */
export const PULSE_AGENT = {
  name: 'Arvind Rajan',
  initials: 'AR',
  role: 'Sales Agent · The Sleep Company',
  level: 7,
  points: 1240,
  streak: 7,           // days
  kudosReceived: 4,
  avatarColor: '#236b4e',
  status: 'active',    // 'active' | 'busy' | 'offline'
}

/* ============================================================
   16. PULSE_CUSTOM_AGENTS — AI-persona agents available in Pulse
   These represent configurable AI personas an agent can interact with.
   ============================================================ */
export const PULSE_CUSTOM_AGENTS = [
  {
    id: 'ca-1',
    name: 'Arya',
    description: 'Your personal sales coach. Provides real-time call tips and objection handling.',
    avatarEmoji: '🧠',
    type: 'custom',
  },
  {
    id: 'ca-2',
    name: 'Lexa',
    description: 'Knowledge assistant. Answers product questions and mattress specifications instantly.',
    avatarEmoji: '📚',
    type: 'custom',
  },
  {
    id: 'ca-3',
    name: 'Calen',
    description: 'Scheduling assistant. Books callbacks and manages your calendar automatically.',
    avatarEmoji: '📅',
    type: 'custom',
  },
]

/* ============================================================
   17. PULSE_ROLE_AGENTS — role-based agents shown in Pulse
   These map to specific job functions within the call centre.
   ============================================================ */
export const PULSE_ROLE_AGENTS = [
  {
    id: 'ra-1',
    name: 'Team Lead',
    agentName: 'Samir Verma',
    role: 'Team Lead',
    initials: 'SV',
    description: 'Oversees Bangalore North team. Approves escalations and reviews KPIs.',
    status: 'active',
  },
  {
    id: 'ra-2',
    name: 'Quality Coach',
    agentName: 'Neethu Pillai',
    role: 'Quality Coach',
    initials: 'NP',
    description: 'Reviews call recordings and provides weekly quality scores.',
    status: 'active',
  },
  {
    id: 'ra-3',
    name: 'Product Specialist',
    agentName: 'Rohit Joshi',
    role: 'Product Specialist',
    initials: 'RJ',
    description: 'Expert on Ortho GRID, Smart GRID, and Ergo Bed products. Available for live consults.',
    status: 'busy',
  },
  {
    id: 'ra-4',
    name: 'Call Centre Agent',
    agentName: 'Arvind Rajan',
    role: 'Call Centre Agent',
    initials: 'AR',
    description: 'Handles outbound and inbound calls, manages lead pipeline, and logs call outcomes.',
    status: 'active',
  },
]

/* ============================================================
   18. PULSE_TASK_AGENTS — task-specific agents shown in Pulse
   All four required agents per the assignment brief.
   percentComplete — proportion of assigned work items finished (0–100).
   ============================================================ */
export const PULSE_TASK_AGENTS = [
  {
    id: 'ta-1',
    name: 'Cross-sell Agent',
    description: 'Identifies cross-sell opportunities within the existing customer base and surfaces product recommendations during calls.',
    avatarEmoji: '🔀',
    percentComplete: 24,
    isActive: true,
  },
  {
    id: 'ta-2',
    name: 'SOP Agent',
    description: 'Guides agents through Standard Operating Procedures in real time, ensuring compliance and consistent call quality.',
    avatarEmoji: '📋',
    percentComplete: 61,
    isActive: true,
  },
  {
    id: 'ta-3',
    name: 'Lead Conversion Agent',
    description: 'Tracks lead progression from first contact to close, flags stalled leads, and recommends next-best actions.',
    avatarEmoji: '🎯',
    percentComplete: 78,
    isActive: true,
  },
  {
    id: 'ta-4',
    name: 'Capture Agent',
    description: 'Automatically captures and structures call outcomes, customer details, and follow-up tasks after each interaction.',
    avatarEmoji: '📥',
    percentComplete: 91,
    isActive: true,
  },
]

/* ============================================================
   19. PULSE_CHANNEL — Pulse team channel metadata
   ============================================================ */
export const PULSE_CHANNEL = {
  id: 'ch-customer-discussions',
  name: 'customer-discussions',
  description: 'Channel for discussing customer interactions.',
  memberCount: 12,
  onlineCount: 7,
  unreadCount: 3,
}

/* ============================================================
   20. PULSE_CHAT — pinned item + recent chat messages
   The pinned item is explicitly as required: "Confirm the 4:30pm callback".
   messageType: 'text' | 'system'
   ============================================================ */
export const PULSE_CHAT = {
  pinnedItem: {
    id: 'pin-1',
    type: 'task',
    text: 'Confirm the 4:30pm callback',
    setBy: 'Samir Verma',
    setByInitials: 'SV',
    timestamp: '2:15 PM',
    relatedContact: 'Priya Iyer',
  },

  messages: [
    {
      id: 'msg-1',
      sender: 'Samir Verma',
      initials: 'SV',
      timestamp: '1:05 PM',
      messageType: 'text',
      text: 'Good work on the Mukunda conversion everyone! 🎉',
    },
    {
      id: 'msg-2',
      sender: 'Neethu Pillai',
      initials: 'NP',
      timestamp: '1:10 PM',
      messageType: 'text',
      text: 'Call quality scores are up this week. Keep it going.',
    },
    {
      id: 'msg-3',
      sender: 'Arvind Rajan',
      initials: 'AR',
      timestamp: '1:18 PM',
      messageType: 'text',
      text: 'Priya Iyer callback confirmed for 4:30 PM. Will share EMI breakdown PDF beforehand.',
    },
    {
      id: 'msg-4',
      sender: 'Samir Verma',
      initials: 'SV',
      timestamp: '2:15 PM',
      messageType: 'text',
      text: 'Reminder: confirm the 4:30pm callback with Priya. She mentioned she might reschedule.',
    },
    {
      id: 'msg-5',
      sender: 'Rohit Joshi',
      initials: 'RJ',
      timestamp: '2:30 PM',
      messageType: 'text',
      text: 'SmartGRID refresher deck is shared in the resources folder. Check before the training on 14th.',
    },
    {
      id: 'msg-6',
      sender: 'Arvind Rajan',
      initials: 'AR',
      timestamp: '2:45 PM',
      messageType: 'text',
      text: 'Got it. Will review the deck tonight.',
    },
  ],
}

/* ============================================================
   21. PULSE_KUDOS — Kudos card content shown in Pulse
   ============================================================ */
export const PULSE_KUDOS = {
  receivedBy: 'Arvind Rajan',
  receivedByInitials: 'AR',
  givenBy: 'Samir Verma',
  givenByInitials: 'SV',
  timestamp: 'Today, 1:05 PM',
  message: 'Outstanding job closing the Mukunda R. order. Great persistence and product knowledge!',
  badge: 'Top Closer',     // badge label shown on Kudos card
  badgeEmoji: '🏆',
}

/* ============================================================
   22. LEADS — lead pipeline records
   Enough records to support pagination (5 per page, 2 pages).

   Fields:
     id, name, initials, product, value (INR),
     status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
     timeRemaining — human label for urgency
     icpPercent    — Ideal Customer Profile match (0–100)
     intentScore   — lead intent index (0–100)
     signals       — breakdown of intent signals (object)
   ============================================================ */
export const LEADS = [
  {
    id: 'lead-1',
    name: 'Mukunda R.',
    initials: 'MR',
    company: null,
    product: 'Ortho GRID',
    value: 9490,           // ₹9,490 — open lead value per assignment brief
    status: 'open',        // open, not yet converted
    timeRemaining: '2h 15m',
    icpPercent: 87,        // ICP 87%
    intentScore: 81,       // lead-intent score ~81
    missedCount: 2,        // cumulative missed contact attempts
    icpBreakdown: 'High demographic match (32yo, urban homeowner). Budget aligns well with premium orthopaedic sleep solutions.',
    howWeGotHere: 'Browsed Ortho GRID product page 3 times, added to cart, dropped off at payment. Requested callback via WhatsApp.',
    signals: {
      financing: 'Asked specifically about EMI options on the Ortho GRID — budget is a live concern, a blocker.',
      quotation: 'Compared pricing with a competitor before reaching out — price-anchored, expects a competitive number.',
      warranty: "Hasn't raised this yet — worth proactively mentioning the 100-night trial to reduce perceived risk.",
      websiteVisits: 8,
      emailOpens: 5,
      formFilled: true,
      callRequested: true,
      documentUploaded: false,
    },
  },
  {
    id: 'lead-2',
    name: 'Priya Iyer',
    initials: 'PI',
    company: null,
    product: 'Smart GRID Mattress',
    value: 18000,
    status: 'qualified',
    timeRemaining: '4h 30m',
    icpPercent: 87,
    intentScore: 87,
    missedCount: 1,
    icpBreakdown: 'Ideal customer profile — tech professional reporting chronic back stiffness from desk work. High disposable income.',
    howWeGotHere: 'Clicked Instagram ad for SmartGRID zero-pressure sleep. Filled consultation form for King size bed.',
    signals: {
      financing: 'Pre-approved for no-cost EMI on credit card — ready to purchase once terms are confirmed.',
      quotation: 'Requested formal price quotation including delivery charges and mattress protector bundle.',
      warranty: 'Inquired about 10-year warranty coverage against sagging and body impression depth.',
      websiteVisits: 5,
      emailOpens: 3,
      formFilled: true,
      callRequested: false,
      documentUploaded: false,
    },
  },
  {
    id: 'lead-3',
    name: 'Suresh Nair',
    initials: 'SN',
    company: null,
    product: 'Ortho GRID',
    value: 12500,
    status: 'contacted',
    timeRemaining: '1d 2h',
    icpPercent: 74,
    intentScore: 74,
    missedCount: 0,
    icpBreakdown: 'Strong fit — looking to replace a 6-year-old sagged coir mattress with medical-grade orthopaedic support.',
    howWeGotHere: 'Inbound inquiry through Google search. Spoke with IVR, opted for specialist callback.',
    signals: {
      financing: 'Checking debit card EMI eligibility — price conscious, looking for zero down payment.',
      quotation: 'Comparing Ortho GRID quote against local orthopaedic mattress dealer pricing.',
      warranty: 'Expressed concern about online return logistics during the 100-night trial period.',
      websiteVisits: 3,
      emailOpens: 2,
      formFilled: false,
      callRequested: false,
      documentUploaded: false,
    },
  },
  {
    id: 'lead-4',
    name: 'Divya Pillai',
    initials: 'DP',
    company: null,
    product: 'Bed Frame & Bundle',
    value: 22000,
    status: 'new',
    timeRemaining: '6h 00m',
    icpPercent: 91,
    intentScore: 83,
    missedCount: 1,
    icpBreakdown: 'Prime family fit — master bedroom renovation, seeking integrated bed frame with SmartGRID mattress bundle.',
    howWeGotHere: 'Existing customer from 2024 pillow purchase. Opened seasonal promotional email and clicked Queen bundle link.',
    signals: {
      financing: 'Flexible on budget — interested in bundle discount with premium wooden bed frame.',
      quotation: 'Asked for bundled pricing breakdown for Queen size frame plus SmartGRID mattress.',
      warranty: 'Asked about separate warranty terms for motorized bed mechanisms and mattress.',
      websiteVisits: 6,
      emailOpens: 4,
      formFilled: true,
      callRequested: true,
      documentUploaded: false,
    },
  },
  {
    id: 'lead-5',
    name: 'Faizan Ahmed',
    initials: 'FA',
    company: null,
    product: 'Smart GRID Mattress',
    value: 24000,
    status: 'contacted',
    timeRemaining: '2d 4h',
    icpPercent: 68,
    intentScore: 60,
    missedCount: 3,
    icpBreakdown: 'Solid profile — newly married, furnishing new apartment. Price comparison shopper seeking EMI flexibility.',
    howWeGotHere: 'Engaged with web chatbot asking about festive discounts and trial periods. Left phone number for sales follow-up.',
    signals: {
      financing: 'Exploring 6-month EMI plan — asked about processing fee waiver.',
      quotation: 'Demanded match on competitor festive discount banner seen online.',
      warranty: 'Very positive about 100-night trial — needs clarification on free pickup policy.',
      websiteVisits: 2,
      emailOpens: 1,
      formFilled: false,
      callRequested: false,
      documentUploaded: false,
    },
  },
  {
    id: 'lead-6',
    name: 'Meena Sundaram',
    initials: 'MS',
    company: null,
    product: 'Smart GRID Luxe',
    value: 50000,
    status: 'new',
    timeRemaining: '3d 0h',
    icpPercent: 70,
    intentScore: 70,
    signals: {
      financing: 'Inquired about corporate discount and high-value purchase EMI tenures.',
      quotation: 'Requested customized dimension quote for super king size bed frame and mattress.',
      warranty: 'Wants full details on 10-year comprehensive replacement policy.',
      websiteVisits: 4,
      emailOpens: 2,
      formFilled: true,
      callRequested: false,
      documentUploaded: false,
    },
  },
  {
    id: 'lead-7',
    name: 'Arjun Krishnan',
    initials: 'AK',
    company: null,
    product: 'SmartGRID Pillow Set',
    value: 9800,
    status: 'new',
    timeRemaining: '5d 12h',
    icpPercent: 62,
    intentScore: 62,
    signals: {
      financing: 'Direct UPI payment preferred — asked about instant cashback.',
      quotation: 'Compared twin pillow set price against standalone ergonomic pillows.',
      warranty: 'Asked if pillows also come with trial period or hygiene seal returns only.',
      websiteVisits: 1,
      emailOpens: 1,
      formFilled: false,
      callRequested: false,
      documentUploaded: false,
    },
  },
  {
    id: 'lead-8',
    name: 'Kavitha Rao',
    initials: 'KR',
    company: null,
    product: 'Recliner Bed Frame',
    value: 35000,
    status: 'qualified',
    timeRemaining: '12h 00m',
    icpPercent: 76,
    intentScore: 76,
    signals: {
      financing: 'Ready to pay upfront via debit card if free installation is included.',
      quotation: 'Requested written quote with GST invoice for home office tax claim.',
      warranty: 'Asked about 5-year German motor warranty and local technician visit turnaround.',
      websiteVisits: 4,
      emailOpens: 3,
      formFilled: true,
      callRequested: false,
      documentUploaded: false,
    },
  },
  {
    id: 'lead-9',
    name: 'Rajan Pillai',
    initials: 'RP',
    company: null,
    product: 'Ortho GRID King',
    value: 16500,
    status: 'contacted',
    timeRemaining: '1d 6h',
    icpPercent: 80,
    intentScore: 78,
    signals: {
      financing: 'Requested cash on delivery (COD) or card swipe on delivery options.',
      quotation: 'Quote shared on WhatsApp; customer reviewing with spouse.',
      warranty: 'Checked orthopaedic doctor certification and spine relief guarantee.',
      websiteVisits: 3,
      emailOpens: 2,
      formFilled: false,
      callRequested: true,
      documentUploaded: false,
    },
  },
  {
    id: 'lead-10',
    name: 'Riku Sharma',
    initials: 'RS',
    company: null,
    product: 'SmartGRID Pillow Set',
    value: 9360,
    status: 'new',
    timeRemaining: '7d 0h',
    icpPercent: 55,
    intentScore: 52,
    signals: {
      financing: 'Checking budget for anniversary gift purchase.',
      quotation: 'Browsed bundle discount offers on website.',
      warranty: 'Standard warranty terms viewed on product FAQ page.',
      websiteVisits: 1,
      emailOpens: 0,
      formFilled: false,
      callRequested: false,
      documentUploaded: false,
    },
  },
]
