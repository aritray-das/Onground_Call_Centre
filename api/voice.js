/**
 * api/voice.js
 *
 * Vercel serverless function — POST /api/voice
 *
 * Twilio calls this webhook when the browser SDK initiates an outbound call.
 * It validates the request signature (if TWILIO_AUTH_TOKEN is set), resolves
 * the destination phone number, and responds with TwiML to connect the call.
 *
 * Required environment variables:
 *   TWILIO_CALLER_ID         — The verified Twilio phone number used as caller ID
 *   DEMO_ALLOWED_NUMBERS     — Comma-separated list of E.164 numbers allowed as destinations
 *
 * Optional environment variables:
 *   TWILIO_AUTH_TOKEN        — When set, the Twilio request signature is validated
 *   DEMO_ROUTE_TO            — When set, ALL calls are routed to this number regardless of `To`
 */

import twilio from 'twilio'

const { VoiceResponse } = twilio.twiml

/**
 * Parse form-encoded body. On Vercel, req.body may arrive as a string
 * (when Content-Type is application/x-www-form-urlencoded) or as an object
 * (when the platform has parsed it). Handle both cases.
 */
function parseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string') {
    const params = new URLSearchParams(req.body)
    const result = {}
    for (const [key, value] of params.entries()) {
      result[key] = value
    }
    return result
  }
  return {}
}

export default function handler(req, res) {
  // Only allow POST (Twilio webhooks are always POST)
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).send('Method Not Allowed')
  }

  // ── Optional: Validate Twilio request signature ───────────────────────
  if (process.env.TWILIO_AUTH_TOKEN) {
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const twilioSignature = req.headers['x-twilio-signature'] || ''

    // Reconstruct the full public URL Twilio signed
    const proto = req.headers['x-forwarded-proto'] || 'https'
    const host = req.headers['x-forwarded-host'] || req.headers['host'] || ''
    const url = `${proto}://${host}/api/voice`

    const body = parseBody(req)

    const isValid = twilio.validateRequest(
      authToken,
      twilioSignature,
      url,
      body
    )

    if (!isValid) {
      return res.status(403).send('Forbidden')
    }
  }

  // ── Parse request body ────────────────────────────────────────────────
  const body = parseBody(req)

  // The `To` parameter Twilio sends is the `params.To` set by the Voice SDK
  let rawTo = (body['To'] || '').toString()

  // Normalize: strip spaces and dashes so comparisons are consistent
  const normalizedTo = rawTo.replace(/[\s-]/g, '')

  // ── Resolve destination ───────────────────────────────────────────────
  let destination

  if (process.env.DEMO_ROUTE_TO) {
    // Hard-coded demo route: all calls go here regardless of `To`
    destination = process.env.DEMO_ROUTE_TO.trim()
  } else {
    // Allowlist check
    const allowedRaw = process.env.DEMO_ALLOWED_NUMBERS || ''
    const allowed = allowedRaw
      .split(',')
      .map((n) => n.trim().replace(/[\s-]/g, ''))
      .filter(Boolean)

    if (!allowed.includes(normalizedTo)) {
      // Destination not in allowlist — politely reject
      const twiml = new VoiceResponse()
      twiml.say('This number is not allowed in this demo.')
      twiml.hangup()
      res.setHeader('Content-Type', 'text/xml')
      return res.status(200).send(twiml.toString())
    }

    destination = normalizedTo
  }

  // ── Build TwiML response ──────────────────────────────────────────────
  const twiml = new VoiceResponse()
  const dial = twiml.dial({
    callerId: process.env.TWILIO_CALLER_ID || '',
    answerOnBridge: true,
  })
  dial.number(destination)

  res.setHeader('Content-Type', 'text/xml')
  return res.status(200).send(twiml.toString())
}
