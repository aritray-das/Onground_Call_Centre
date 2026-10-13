/**
 * api/token.js
 *
 * Vercel serverless function — POST /api/token
 *
 * Issues a short-lived Twilio Access Token that the browser SDK uses to
 * place outbound calls via the configured TwiML App.
 *
 * Required environment variables (set in Vercel dashboard or .env.local):
 *   TWILIO_ACCOUNT_SID       — Twilio account SID (AC...)
 *   TWILIO_API_KEY_SID       — API Key SID (SK...)
 *   TWILIO_API_KEY_SECRET    — API Key secret
 *   TWILIO_TWIML_APP_SID     — TwiML App SID (AP...)
 *   DEMO_PASSCODE            — Shared secret sent by the client in x-demo-passcode
 */

import twilio from 'twilio'

const { AccessToken } = twilio.jwt
const { VoiceGrant } = AccessToken

/**
 * Constant-time string comparison to resist timing side-channel attacks.
 * Uses a simple XOR accumulation — suitable for passcodes of any length.
 */
function safeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false
  // Use the longer length to ensure we don't short-circuit
  const maxLen = Math.max(a.length, b.length)
  const bufA = Buffer.from(a.padEnd(maxLen))
  const bufB = Buffer.from(b.padEnd(maxLen))
  let diff = bufA.length ^ bufB.length
  for (let i = 0; i < bufA.length; i++) {
    diff |= bufA[i] ^ bufB[i]
  }
  return diff === 0
}

export default function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  // ── Passcode check ────────────────────────────────────────────────────
  const passcode = req.headers['x-demo-passcode'] || ''
  const expected = process.env.DEMO_PASSCODE || ''

  if (!expected) {
    // Fail closed: if DEMO_PASSCODE is not configured, deny all requests
    return res.status(500).json({ error: 'Server configuration error' })
  }

  if (!safeCompare(passcode, expected)) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // ── Validate required env vars ────────────────────────────────────────
  const {
    TWILIO_ACCOUNT_SID,
    TWILIO_API_KEY_SID,
    TWILIO_API_KEY_SECRET,
    TWILIO_TWIML_APP_SID,
  } = process.env

  if (
    !TWILIO_ACCOUNT_SID ||
    !TWILIO_API_KEY_SID ||
    !TWILIO_API_KEY_SECRET ||
    !TWILIO_TWIML_APP_SID
  ) {
    return res.status(500).json({ error: 'Server configuration error' })
  }

  // ── Create Access Token ───────────────────────────────────────────────
  const token = new AccessToken(
    TWILIO_ACCOUNT_SID,
    TWILIO_API_KEY_SID,
    TWILIO_API_KEY_SECRET,
    { identity: 'agent-demo', ttl: 3600 }
  )

  // Attach VoiceGrant — outgoing only; incomingAllow intentionally false
  const grant = new VoiceGrant({
    outgoingApplicationSid: TWILIO_TWIML_APP_SID,
    incomingAllow: false,
  })
  token.addGrant(grant)

  return res.status(200).json({ token: token.toJwt() })
}
