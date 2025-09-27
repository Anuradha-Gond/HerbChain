// Custom hook for voice assistant functionality
"use client"

import { useState, useEffect, useCallback } from "react"
import { voiceCommandProcessor, type VoiceAction } from "@/lib/voice-commands"
import { useToast } from "@/hooks/use-toast"

interface UseVoiceAssistantOptions {
  language?: string
  onCommand?: (action: VoiceAction) => void
  autoStart?: boolean
}

export function useVoiceAssistant({ language = "hi-IN", onCommand, autoStart = false }: UseVoiceAssistantOptions = {}) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [confidence, setConfidence] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const { toast } = useToast()

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (SpeechRecognition) {
      setIsSupported(true)

      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = language
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        setIsListening(true)
        setError(null)
        setTranscript("")
      }

      recognition.onresult = (event) => {
        const result = event.results[0][0]
        setTranscript(result.transcript)
        setConfidence(result.confidence)

        // Process the command
        const action = voiceCommandProcessor.processCommand(result.transcript, language)
        if (action) {
          onCommand?.(action)
        } else {
          toast({
            title: "Command not recognized",
            description: `"${result.transcript}" is not a valid command`,
            variant: "destructive",
          })
        }
      }

      recognition.onerror = (event) => {
        setError(event.error)
        setIsListening(false)

        if (event.error === "not-allowed") {
          toast({
            title: "Microphone access denied",
            description: "Please allow microphone access to use voice commands",
            variant: "destructive",
          })
        }
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      // Store recognition instance
      ;(window as any).__voiceRecognition = recognition

      if (autoStart) {
        startListening()
      }
    }

    return () => {
      if ((window as any).__voiceRecognition) {
        ;(window as any).__voiceRecognition.abort()
      }
    }
  }, [language, onCommand, autoStart])

  const startListening = useCallback(() => {
    const recognition = (window as any).__voiceRecognition
    if (recognition && !isListening) {
      try {
        recognition.lang = language
        recognition.start()
      } catch (err) {
        console.error("Failed to start voice recognition:", err)
        setError("Failed to start voice recognition")
      }
    }
  }, [isListening, language])

  const stopListening = useCallback(() => {
    const recognition = (window as any).__voiceRecognition
    if (recognition && isListening) {
      recognition.stop()
    }
  }, [isListening])

  const speak = useCallback(
    (text: string, lang: string = language) => {
      if ("speechSynthesis" in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel()

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = lang
        utterance.rate = 0.9
        utterance.pitch = 1

        window.speechSynthesis.speak(utterance)
      }
    },
    [language],
  )

  const getAvailableCommands = useCallback(() => {
    return voiceCommandProcessor.getCommandSuggestions(language)
  }, [language])

  const getCommandHistory = useCallback(() => {
    return voiceCommandProcessor.getCommandHistory()
  }, [])

  return {
    isListening,
    isSupported,
    transcript,
    confidence,
    error,
    startListening,
    stopListening,
    speak,
    getAvailableCommands,
    getCommandHistory,
  }
}
