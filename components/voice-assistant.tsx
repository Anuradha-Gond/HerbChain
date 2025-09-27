// Voice Assistant Component with Multi-language Support
"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { SpeechRecognition, SpeechSynthesis } from "web-speech-api"

interface VoiceCommand {
  command: string
  action: string
  params?: any
}

interface Language {
  code: string
  name: string
  nativeName: string
}

const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en-US", name: "English", nativeName: "English" },
  { code: "hi-IN", name: "Hindi", nativeName: "हिंदी" },
  { code: "mr-IN", name: "Marathi", nativeName: "मराठी" },
  { code: "ta-IN", name: "Tamil", nativeName: "தமிழ்" },
  { code: "te-IN", name: "Telugu", nativeName: "తెలుగు" },
  { code: "kn-IN", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "gu-IN", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "bn-IN", name: "Bengali", nativeName: "বাংলা" },
]

// Command mappings for different languages
const COMMAND_MAPPINGS: Record<string, VoiceCommand[]> = {
  "en-US": [
    { command: "add new batch", action: "ADD_BATCH" },
    { command: "show history", action: "SHOW_HISTORY" },
    { command: "generate qr code", action: "GENERATE_QR" },
    { command: "upload photo", action: "UPLOAD_PHOTO" },
    { command: "check status", action: "CHECK_STATUS" },
    { command: "help", action: "SHOW_HELP" },
  ],
  "hi-IN": [
    { command: "नई बैच जोड़ो", action: "ADD_BATCH" },
    { command: "इतिहास दिखाओ", action: "SHOW_HISTORY" },
    { command: "क्यूआर कोड बनाओ", action: "GENERATE_QR" },
    { command: "फोटो अपलोड करो", action: "UPLOAD_PHOTO" },
    { command: "स्थिति जांचो", action: "CHECK_STATUS" },
    { command: "मदद", action: "SHOW_HELP" },
  ],
  "mr-IN": [
    { command: "नवीन बॅच जोडा", action: "ADD_BATCH" },
    { command: "इतिहास दाखवा", action: "SHOW_HISTORY" },
    { command: "क्यूआर कोड तयार करा", action: "GENERATE_QR" },
    { command: "फोटो अपलोड करा", action: "UPLOAD_PHOTO" },
    { command: "स्थिती तपासा", action: "CHECK_STATUS" },
    { command: "मदत", action: "SHOW_HELP" },
  ],
  "ta-IN": [
    { command: "புதிய தொகுப்பு சேர்க்கவும்", action: "ADD_BATCH" },
    { command: "வரலாறு காட்டு", action: "SHOW_HISTORY" },
    { command: "க்யூஆர் குறியீடு உருவாக்கு", action: "GENERATE_QR" },
    { command: "புகைப்படம் பதிவேற்று", action: "UPLOAD_PHOTO" },
    { command: "நிலையை சரிபார்க்கவும்", action: "CHECK_STATUS" },
    { command: "உதவி", action: "SHOW_HELP" },
  ],
}

// Response messages in different languages
const RESPONSE_MESSAGES: Record<string, Record<string, string>> = {
  "en-US": {
    ADD_BATCH: "Opening add new batch form",
    SHOW_HISTORY: "Showing batch history",
    GENERATE_QR: "Generating QR code",
    UPLOAD_PHOTO: "Opening photo upload",
    CHECK_STATUS: "Checking batch status",
    SHOW_HELP: "Here are the available commands",
    LISTENING: "Listening...",
    NOT_UNDERSTOOD: "Sorry, I didn't understand that command",
    MIC_ERROR: "Microphone access denied or not available",
  },
  "hi-IN": {
    ADD_BATCH: "नई बैच जोड़ने का फॉर्म खोल दिया गया है",
    SHOW_HISTORY: "बैच का इतिहास दिखाया जा रहा है",
    GENERATE_QR: "क्यूआर कोड बनाया जा रहा है",
    UPLOAD_PHOTO: "फोटो अपलोड खोला जा रहा है",
    CHECK_STATUS: "बैच की स्थिति जांची जा रही है",
    SHOW_HELP: "यहाँ उपलब्ध कमांड हैं",
    LISTENING: "सुन रहा हूँ...",
    NOT_UNDERSTOOD: "माफ करें, मैं उस कमांड को समझ नहीं पाया",
    MIC_ERROR: "माइक्रोफोन की अनुमति नहीं मिली या उपलब्ध नहीं है",
  },
  "mr-IN": {
    ADD_BATCH: "नवीन बॅच जोडण्याचा फॉर्म उघडला आहे",
    SHOW_HISTORY: "बॅचचा इतिहास दाखवला जात आहे",
    GENERATE_QR: "क्यूआर कोड तयार केला जात आहे",
    UPLOAD_PHOTO: "फोटो अपलोड उघडले जात आहे",
    CHECK_STATUS: "बॅचची स्थिती तपासली जात आहे",
    SHOW_HELP: "येथे उपलब्ध कमांड आहेत",
    LISTENING: "ऐकत आहे...",
    NOT_UNDERSTOOD: "माफ करा, मला तो कमांड समजला नाही",
    MIC_ERROR: "मायक्रोफोनची परवानगी नाही किंवा उपलब्ध नाही",
  },
  "ta-IN": {
    ADD_BATCH: "புதிய தொகுப்பு சேர்க்கும் படிவம் திறக்கப்பட்டது",
    SHOW_HISTORY: "தொகுப்பு வரலாறு காட்டப்படுகிறது",
    GENERATE_QR: "க்யூஆர் குறியீடு உருவாக்கப்படுகிறது",
    UPLOAD_PHOTO: "புகைப்பட பதிவேற்றம் திறக்கப்படுகிறது",
    CHECK_STATUS: "தொகுப்பு நிலை சரிபார்க்கப்படுகிறது",
    SHOW_HELP: "இங்கே கிடைக்கும் கட்டளைகள்",
    LISTENING: "கேட்டுக்கொண்டிருக்கிறது...",
    NOT_UNDERSTOOD: "மன்னிக்கவும், அந்த கட்டளையை என்னால் புரிந்துகொள்ள முடியவில்லை",
    MIC_ERROR: "மைக்ரோஃபோன் அணுகல் மறுக்கப்பட்டது அல்லது கிடைக்கவில்லை",
  },
}

interface VoiceAssistantProps {
  onCommand?: (action: string, params?: any) => void
  className?: string
}

export function VoiceAssistant({ onCommand, className }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false)
  const [language, setLanguage] = useState("hi-IN") // Default to Hindi for farmers
  const [transcript, setTranscript] = useState("")
  const [isSupported, setIsSupported] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [lastCommand, setLastCommand] = useState<string | null>(null)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const speechSynthesis = window.speechSynthesis

    if (SpeechRecognition && speechSynthesis) {
      setIsSupported(true)
      synthRef.current = speechSynthesis

      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = language

      recognition.onstart = () => {
        setIsListening(true)
        setTranscript("")
      }

      recognition.onresult = (event) => {
        const result = event.results[0][0].transcript.toLowerCase().trim()
        setTranscript(result)
        processVoiceCommand(result)
      }

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)

        if (event.error === "not-allowed") {
          toast({
            title: "Microphone Access",
            description: getResponseMessage("MIC_ERROR"),
            variant: "destructive",
          })
        }
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [language])

  const getResponseMessage = (key: string): string => {
    return RESPONSE_MESSAGES[language]?.[key] || RESPONSE_MESSAGES["en-US"][key] || key
  }

  const processVoiceCommand = (transcript: string) => {
    const commands = COMMAND_MAPPINGS[language] || COMMAND_MAPPINGS["en-US"]

    // Find matching command
    const matchedCommand = commands.find(
      (cmd) => transcript.includes(cmd.command.toLowerCase()) || cmd.command.toLowerCase().includes(transcript),
    )

    if (matchedCommand) {
      setLastCommand(matchedCommand.command)
      const responseMessage = getResponseMessage(matchedCommand.action)

      // Speak the response
      speakText(responseMessage)

      // Execute the command
      onCommand?.(matchedCommand.action, matchedCommand.params)

      toast({
        title: "Command Executed",
        description: responseMessage,
      })
    } else {
      const notUnderstoodMessage = getResponseMessage("NOT_UNDERSTOOD")
      speakText(notUnderstoodMessage)

      toast({
        title: "Command Not Recognized",
        description: notUnderstoodMessage,
        variant: "destructive",
      })
    }
  }

  const speakText = (text: string) => {
    if (!synthRef.current) return

    // Cancel any ongoing speech
    synthRef.current.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = language
    utterance.rate = 0.9
    utterance.pitch = 1

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    synthRef.current.speak(utterance)
  }

  const startListening = () => {
    if (!recognitionRef.current || isListening) return

    try {
      recognitionRef.current.lang = language
      recognitionRef.current.start()
      speakText(getResponseMessage("LISTENING"))
    } catch (error) {
      console.error("Error starting speech recognition:", error)
      toast({
        title: "Error",
        description: "Failed to start voice recognition",
        variant: "destructive",
      })
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  const getAvailableCommands = () => {
    const commands = COMMAND_MAPPINGS[language] || COMMAND_MAPPINGS["en-US"]
    return commands.map((cmd) => cmd.command)
  }

  if (!isSupported) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MicOff className="w-5 h-5" />
            Voice Assistant
          </CardTitle>
          <CardDescription>
            Voice recognition is not supported in this browser. Please use Chrome or Edge for voice features.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="w-5 h-5" />
          Voice Assistant
          <Badge variant="secondary">{SUPPORTED_LANGUAGES.find((lang) => lang.code === language)?.nativeName}</Badge>
        </CardTitle>
        <CardDescription>Speak commands in your preferred language to interact with HerbChain</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.nativeName} ({lang.name})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={isListening ? stopListening : startListening}
            disabled={isSpeaking}
            variant={isListening ? "destructive" : "default"}
            size="lg"
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4 mr-2" />
                Stop Listening
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 mr-2" />
                Start Listening
              </>
            )}
          </Button>

          <Button
            onClick={isSpeaking ? stopSpeaking : () => speakText(getResponseMessage("SHOW_HELP"))}
            variant="outline"
            size="lg"
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4 mr-2" />
                Stop Speaking
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 mr-2" />
                Help
              </>
            )}
          </Button>
        </div>

        {isListening && (
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="font-medium">{getResponseMessage("LISTENING")}</span>
            </div>
          </div>
        )}

        {transcript && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">You said:</p>
            <p className="font-medium">{transcript}</p>
          </div>
        )}

        {lastCommand && (
          <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400">Last command:</p>
            <p className="font-medium text-green-700 dark:text-green-300">{lastCommand}</p>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Available Commands:</h4>
          <div className="grid grid-cols-1 gap-1 text-sm">
            {getAvailableCommands().map((command, index) => (
              <Badge key={index} variant="outline" className="justify-start">
                "{command}"
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
