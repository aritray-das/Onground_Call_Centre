import { useState, useEffect, useRef, useCallback } from 'react'
import { Device } from '@twilio/voice-sdk'

/**
 * Maps Twilio and browser errors to plain, user-friendly messages.
 */
function mapTwilioError(err) {
  if (!err) return 'An unexpected error occurred.'

  const message = String(err.message || '')
  const code = err.code

  if (err.status === 401 || err.name === 'Unauthorized' || /passcode/i.test(message)) {
    return 'Wrong passcode. Please check your demo passcode and try again.'
  }

  if (
    err.name === 'NotAllowedError' ||
    err.name === 'PermissionDeniedError' ||
    code === 31401 ||
    /permission|denied|microphone|UserMedia/i.test(message)
  ) {
    return 'Microphone access was denied. Please allow microphone permissions.'
  }

  if (code === 31603 || /not allowed|forbidden|unauthorized number/i.test(message)) {
    return 'This phone number is not allowed in this demo.'
  }

  if (
    code === 31005 ||
    code === 31003 ||
    code === 31002 ||
    /network|offline|failed to fetch|timeout|connection/i.test(message)
  ) {
    return 'Network error. Please check your connection.'
  }

  return message || 'Call failed. Please try again.'
}

/**
 * useTwilioCall
 *
 * Real browser-to-phone voice calling hook powered by @twilio/voice-sdk.
 * Manages token lifecycle, Device instance, and call status.
 */
export function useTwilioCall() {
  const [passcode, setPasscode] = useState(() => {
    try {
      return sessionStorage.getItem('demo_passcode') || 'onground2026'
    } catch {
      return 'onground2026'
    }
  })
  const [status, setStatus] = useState('idle') // 'idle' | 'connecting' | 'ringing' | 'in-call' | 'error'
  const [errorMessage, setErrorMessage] = useState(null)
  const [isMuted, setIsMuted] = useState(false)
  const [callSeconds, setCallSeconds] = useState(0)

  const deviceRef = useRef(null)
  const callRef = useRef(null)
  const timerRef = useRef(null)
  const trialTimerRef = useRef([])
  const passcodeRef = useRef(passcode)
  const isMountedRef = useRef(true)

  useEffect(() => {
    passcodeRef.current = passcode
  }, [passcode])

  const updatePasscode = useCallback((newPasscode) => {
    setPasscode(newPasscode)
    passcodeRef.current = newPasscode
    try {
      sessionStorage.setItem('demo_passcode', newPasscode)
    } catch {
      // ignore
    }
    // If device was previously instantiated with old passcode, destroy it to force fresh token
    if (deviceRef.current) {
      try {
        deviceRef.current.destroy()
      } catch {
        // ignore
      }
      deviceRef.current = null
    }
  }, [])

  const fetchToken = useCallback(async (code) => {
    if (!code?.trim()) {
      throw { status: 401, message: 'Please enter a demo passcode.' }
    }

    let res
    try {
      res = await fetch('/api/token', {
        method: 'POST',
        headers: {
          'x-demo-passcode': code.trim(),
        },
      })
    } catch {
      throw { message: 'Network error. Please check your connection.' }
    }

    if (res.status === 401) {
      throw { status: 401, message: 'Wrong passcode. Please check your demo passcode and try again.' }
    }
    if (!res.ok) {
      throw { message: 'Server configuration error. Please check your server setup.' }
    }

    const data = await res.json()
    if (!data?.token) {
      throw { message: 'Invalid token response received from server.' }
    }
    return data.token
  }, [])

  const getOrCreateDevice = useCallback(async (code) => {
    if (deviceRef.current && !deviceRef.current.isDestroyed) {
      return deviceRef.current
    }

    const token = await fetchToken(code)
    const device = new Device(token)

    device.on('tokenWillExpire', async (dev) => {
      try {
        const currentCode = passcodeRef.current?.trim()
        if (!currentCode) return
        const newToken = await fetchToken(currentCode)
        dev.updateToken(newToken)
      } catch (err) {
        console.warn('Failed to refresh Twilio token:', err)
      }
    })

    device.on('error', (err) => {
      if (!isMountedRef.current) return
      setErrorMessage(mapTwilioError(err))
      setStatus('error')
    })

    deviceRef.current = device
    return device
  }, [fetchToken])

  const cleanupCall = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (trialTimerRef.current?.length) {
      trialTimerRef.current.forEach((t) => clearTimeout(t))
      trialTimerRef.current = []
    }
    callRef.current = null
    setIsMuted(false)
    setCallSeconds(0)
  }, [])

  // Manage in-call timer
  useEffect(() => {
    if (status === 'in-call') {
      timerRef.current = setInterval(() => {
        setCallSeconds((s) => s + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [status])

  // Destroy device on unmount
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      if (callRef.current) {
        try {
          callRef.current.disconnect()
        } catch {
          // ignore
        }
        callRef.current = null
      }
      if (deviceRef.current) {
        try {
          deviceRef.current.destroy()
        } catch {
          // ignore
        }
        deviceRef.current = null
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [])

  const startCall = useCallback(async (number) => {
    const trimmedNumber = (number || '').trim()
    if (!trimmedNumber) {
      setStatus('error')
      setErrorMessage('Please enter a phone number.')
      return
    }

    const code = passcodeRef.current?.trim()
    if (!code) {
      setStatus('error')
      setErrorMessage('Please enter a demo passcode.')
      return
    }

    // Ask for microphone access only when a call starts
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((track) => track.stop())
    } catch (err) {
      setStatus('error')
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage('Microphone access was denied. Please allow microphone permissions.')
      } else {
        setErrorMessage('Could not access microphone: ' + (err.message || 'permission denied'))
      }
      return
    }

    setCallSeconds(0)
    setStatus('connecting')
    setErrorMessage(null)

    let device
    try {
      device = await getOrCreateDevice(code)
    } catch (err) {
      setStatus('error')
      setErrorMessage(mapTwilioError(err))
      return
    }

    if (callRef.current) {
      try {
        callRef.current.disconnect()
      } catch {
        // ignore
      }
      cleanupCall()
    }

    try {
      const call = await device.connect({ params: { To: trimmedNumber } })
      callRef.current = call

      call.on('ringing', () => {
        if (!isMountedRef.current) return
        setStatus('ringing')
      })

      call.on('accept', () => {
        if (!isMountedRef.current) return
        setCallSeconds(0)
        setStatus('in-call')
        setIsMuted(call.isMuted())

        // Twilio Trial Accounts prompt: "Press any key to execute your code".
        // Auto-send digit '1' at 1.5s and 3s to automatically bypass this prompt.
        const t1 = setTimeout(() => {
          if (callRef.current && isMountedRef.current) {
            try {
              callRef.current.sendDigits('1')
            } catch {
              // ignore
            }
          }
        }, 1500)

        const t2 = setTimeout(() => {
          if (callRef.current && isMountedRef.current) {
            try {
              callRef.current.sendDigits('1')
            } catch {
              // ignore
            }
          }
        }, 3000)

        trialTimerRef.current = [t1, t2]
      })

      call.on('disconnect', () => {
        if (!isMountedRef.current) return
        cleanupCall()
        setStatus('idle')
      })

      call.on('cancel', () => {
        if (!isMountedRef.current) return
        cleanupCall()
        setStatus('idle')
      })

      call.on('error', (err) => {
        if (!isMountedRef.current) return
        cleanupCall()
        setStatus('error')
        setErrorMessage(mapTwilioError(err))
      })
    } catch (err) {
      cleanupCall()
      setStatus('error')
      setErrorMessage(mapTwilioError(err))
    }
  }, [cleanupCall, getOrCreateDevice])

  const hangUp = useCallback(() => {
    if (callRef.current) {
      try {
        callRef.current.disconnect()
      } catch {
        // ignore
      }
    }
    cleanupCall()
    setStatus('idle')
  }, [cleanupCall])

  const toggleMute = useCallback(() => {
    if (!callRef.current) return
    const next = !isMuted
    try {
      callRef.current.mute(next)
      setIsMuted(next)
    } catch {
      // ignore
    }
  }, [isMuted])

  const sendDigits = useCallback((digits) => {
    if (!callRef.current) return
    try {
      callRef.current.sendDigits(digits)
    } catch {
      // ignore
    }
  }, [])

  return {
    status,
    errorMessage,
    startCall,
    hangUp,
    toggleMute,
    sendDigits,
    isMuted,
    callSeconds,
    passcode,
    setPasscode: updatePasscode,
  }
}
