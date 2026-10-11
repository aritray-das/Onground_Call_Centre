import { useState, useEffect, useRef, useCallback } from 'react'
import { Peer } from 'peerjs'

function generateShortId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = 'og-'
  for (let i = 0; i < 5; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

/**
 * usePeerCall
 *
 * Real browser-to-browser WebRTC voice calling hook powered by PeerJS.
 * Connects to public PeerJS cloud broker to exchange WebRTC offer/answer,
 * then establishes direct peer-to-peer audio stream.
 */
export function usePeerCall() {
  const [myId, setMyId] = useState('')
  const [status, setStatus] = useState('connecting') // 'connecting' | 'ready' | 'calling' | 'ringing' | 'in-call' | 'error'
  const [errorMessage, setErrorMessage] = useState(null)
  const [callerId, setCallerId] = useState('')
  const [isMuted, setIsMuted] = useState(false)
  const [callSeconds, setCallSeconds] = useState(0)
  const [remoteStream, setRemoteStream] = useState(null)

  const peerRef = useRef(null)
  const currentCallRef = useRef(null)
  const incomingCallRef = useRef(null)
  const localStreamRef = useRef(null)
  const timerRef = useRef(null)
  const isMountedRef = useRef(true)

  // Internal helper to stop local microphone stream and reset call references
  const cleanupCall = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop())
      localStreamRef.current = null
    }

    if (currentCallRef.current) {
      currentCallRef.current.close()
      currentCallRef.current = null
    }

    if (incomingCallRef.current) {
      incomingCallRef.current.close()
      incomingCallRef.current = null
    }

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    setIsMuted(false)
    setCallSeconds(0)
    setRemoteStream(null)
    setCallerId('')

    if (isMountedRef.current) {
      // If peer is still alive and ready, go back to ready
      if (peerRef.current && !peerRef.current.destroyed && !peerRef.current.disconnected) {
        setStatus('ready')
      }
    }
  }, [])

  useEffect(() => {
    isMountedRef.current = true

    function initPeer(retryCount = 0) {
      if (retryCount > 5) {
        if (isMountedRef.current) {
          setStatus('error')
          setErrorMessage('Could not establish connection to the calling server. Please refresh.')
        }
        return
      }

      if (peerRef.current) {
        peerRef.current.destroy()
        peerRef.current = null
      }

      const assignedId = generateShortId()
      const peer = new Peer(assignedId)
      peerRef.current = peer

      peer.on('open', (id) => {
        if (!isMountedRef.current) return
        setMyId(id)
        setStatus('ready')
        setErrorMessage(null)
      })

      peer.on('call', (incomingCall) => {
        if (!isMountedRef.current) return

        // If already in a call or calling, automatically decline busy call
        if (currentCallRef.current) {
          incomingCall.close()
          return
        }

        incomingCallRef.current = incomingCall
        setCallerId(incomingCall.peer || 'Unknown')
        setStatus('ringing')
        setErrorMessage(null)

        incomingCall.on('close', () => {
          cleanupCall()
        })

        incomingCall.on('error', (err) => {
          cleanupCall()
          setErrorMessage(err.message || 'Call disconnected.')
        })
      })

      peer.on('error', (err) => {
        if (!isMountedRef.current) return

        if (err.type === 'unavailable-id') {
          // ID collision - retry with fresh random ID
          initPeer(retryCount + 1)
        } else if (err.type === 'peer-unavailable') {
          cleanupCall()
          setErrorMessage('User unavailable: could not connect to that call ID.')
        } else if (err.type === 'network' || err.type === 'server-error') {
          setStatus('error')
          setErrorMessage('Connection error. Retrying connection...')
        } else {
          setErrorMessage(err.message || 'A calling error occurred.')
        }
      })

      peer.on('disconnected', () => {
        if (isMountedRef.current && peer && !peer.destroyed) {
          peer.reconnect()
        }
      })
    }

    initPeer(0)

    return () => {
      isMountedRef.current = false
      cleanupCall()
      if (peerRef.current) {
        peerRef.current.destroy()
        peerRef.current = null
      }
    }
  }, [cleanupCall])

  // In-call duration timer
  useEffect(() => {
    if (status === 'in-call') {
      timerRef.current = setInterval(() => {
        setCallSeconds((prev) => prev + 1)
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

  // Start outgoing call
  const startCall = useCallback(async (targetId) => {
    const trimmedId = (targetId || '').trim()
    if (!trimmedId) {
      setErrorMessage('Please enter an ID to call.')
      return
    }

    if (trimmedId === myId) {
      setErrorMessage('Cannot call your own ID. Open the app on another tab or device to test.')
      return
    }

    if (!peerRef.current || peerRef.current.destroyed) {
      setErrorMessage('Calling service is not connected. Please wait a moment.')
      return
    }

    setErrorMessage(null)
    setStatus('calling')

    let stream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      localStreamRef.current = stream
    } catch (err) {
      setStatus('ready')
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage('Microphone access was denied. Please allow microphone permissions to make voice calls.')
      } else {
        setErrorMessage('Could not access microphone: ' + err.message)
      }
      return
    }

    try {
      const call = peerRef.current.call(trimmedId, stream)
      currentCallRef.current = call

      call.on('stream', (remoteMediaStream) => {
        if (!isMountedRef.current) return
        setRemoteStream(remoteMediaStream)
        setStatus('in-call')
        setErrorMessage(null)
      })

      call.on('close', () => {
        cleanupCall()
      })

      call.on('error', (err) => {
        cleanupCall()
        setErrorMessage('Call ended: ' + (err.message || 'connection closed'))
      })
    } catch (err) {
      cleanupCall()
      setErrorMessage('Failed to start call: ' + err.message)
    }
  }, [myId, cleanupCall])

  // Answer incoming call
  const answer = useCallback(async () => {
    if (!incomingCallRef.current) return

    setErrorMessage(null)

    let stream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      localStreamRef.current = stream
    } catch (err) {
      cleanupCall()
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage('Microphone access was denied. Please allow microphone permissions to answer calls.')
      } else {
        setErrorMessage('Could not access microphone: ' + err.message)
      }
      return
    }

    const call = incomingCallRef.current
    currentCallRef.current = call
    incomingCallRef.current = null

    call.answer(stream)

    call.on('stream', (remoteMediaStream) => {
      if (!isMountedRef.current) return
      setRemoteStream(remoteMediaStream)
      setStatus('in-call')
      setErrorMessage(null)
    })

    call.on('close', () => {
      cleanupCall()
    })

    call.on('error', (err) => {
      cleanupCall()
      setErrorMessage('Call ended: ' + (err.message || 'connection closed'))
    })
  }, [cleanupCall])

  // Decline incoming call
  const decline = useCallback(() => {
    if (incomingCallRef.current) {
      incomingCallRef.current.close()
    }
    cleanupCall()
  }, [cleanupCall])

  // Hang up active call or cancel outgoing call
  const hangUp = useCallback(() => {
    cleanupCall()
  }, [cleanupCall])

  // Toggle microphone mute
  const toggleMute = useCallback(() => {
    if (!localStreamRef.current) return

    const audioTracks = localStreamRef.current.getAudioTracks()
    if (audioTracks.length === 0) return

    const nextMuteState = !isMuted
    audioTracks.forEach((track) => {
      track.enabled = !nextMuteState
    })
    setIsMuted(nextMuteState)
  }, [isMuted])

  return {
    myId,
    status,
    errorMessage,
    callerId,
    startCall,
    answer,
    decline,
    hangUp,
    toggleMute,
    isMuted,
    callSeconds,
    remoteStream,
  }
}
