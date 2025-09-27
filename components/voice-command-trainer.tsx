// Voice command training component for better recognition
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Mic, CheckCircle, XCircle, RotateCcw } from "lucide-react"
import { useVoiceAssistant } from "@/hooks/use-voice-assistant"

const TRAINING_COMMANDS = {
  "hi-IN": ["नई बैच जोड़ो", "इतिहास दिखाओ", "क्यूआर कोड बनाओ", "फोटो अपलोड करो", "स्थिति जांचो"],
  "en-US": ["add new batch", "show history", "generate qr code", "upload photo", "check status"],
  "mr-IN": ["नवीन बॅच जोडा", "इतिहास दाखवा", "क्यूआर कोड तयार करा", "फोटो अपलोड करा", "स्थिती तपासा"],
}

export function VoiceCommandTrainer() {
  const [language, setLanguage] = useState("hi-IN")
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0)
  const [trainingResults, setTrainingResults] = useState<boolean[]>([])
  const [isTraining, setIsTraining] = useState(false)
  const [customCommand, setCustomCommand] = useState("")

  const { isListening, transcript, startListening, stopListening, speak } = useVoiceAssistant({
    language,
    onCommand: (action) => {
      // Handle training result
      const expectedCommand = TRAINING_COMMANDS[language as keyof typeof TRAINING_COMMANDS][currentCommandIndex]
      const isCorrect =
        transcript.toLowerCase().includes(expectedCommand.toLowerCase()) ||
        expectedCommand.toLowerCase().includes(transcript.toLowerCase())

      const newResults = [...trainingResults]
      newResults[currentCommandIndex] = isCorrect
      setTrainingResults(newResults)

      if (currentCommandIndex < TRAINING_COMMANDS[language as keyof typeof TRAINING_COMMANDS].length - 1) {
        setCurrentCommandIndex(currentCommandIndex + 1)
      } else {
        setIsTraining(false)
        const accuracy = (newResults.filter(Boolean).length / newResults.length) * 100
        speak(`Training completed. Accuracy: ${accuracy.toFixed(0)} percent`)
      }
    },
  })

  const startTraining = () => {
    setIsTraining(true)
    setCurrentCommandIndex(0)
    setTrainingResults([])

    const firstCommand = TRAINING_COMMANDS[language as keyof typeof TRAINING_COMMANDS][0]
    speak(`Training started. Please say: ${firstCommand}`)
  }

  const resetTraining = () => {
    setIsTraining(false)
    setCurrentCommandIndex(0)
    setTrainingResults([])
  }

  const skipCommand = () => {
    const newResults = [...trainingResults]
    newResults[currentCommandIndex] = false
    setTrainingResults(newResults)

    if (currentCommandIndex < TRAINING_COMMANDS[language as keyof typeof TRAINING_COMMANDS].length - 1) {
      setCurrentCommandIndex(currentCommandIndex + 1)
    } else {
      setIsTraining(false)
    }
  }

  const addCustomCommand = () => {
    if (customCommand.trim()) {
      // In a real implementation, this would save to user preferences
      console.log("Adding custom command:", customCommand)
      setCustomCommand("")
    }
  }

  const currentCommands = TRAINING_COMMANDS[language as keyof typeof TRAINING_COMMANDS] || []
  const progress = trainingResults.length > 0 ? (trainingResults.length / currentCommands.length) * 100 : 0
  const accuracy =
    trainingResults.length > 0 ? (trainingResults.filter(Boolean).length / trainingResults.length) * 100 : 0

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="w-5 h-5" />
          Voice Command Training
        </CardTitle>
        <CardDescription>Train the voice assistant to better recognize your voice and accent</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Label htmlFor="language">Training Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hi-IN">हिंदी (Hindi)</SelectItem>
                <SelectItem value="en-US">English</SelectItem>
                <SelectItem value="mr-IN">मराठी (Marathi)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button onClick={startTraining} disabled={isTraining}>
              Start Training
            </Button>
            <Button onClick={resetTraining} variant="outline" size="icon">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {isTraining && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Training Progress</span>
                <span className="text-sm text-muted-foreground">
                  {currentCommandIndex + 1} of {currentCommands.length}
                </span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>

            <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
              <div className="space-y-2">
                <p className="text-sm font-medium">Please say this command:</p>
                <p className="text-lg font-bold text-blue-700 dark:text-blue-400">
                  "{currentCommands[currentCommandIndex]}"
                </p>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <Button
                  onClick={isListening ? stopListening : startListening}
                  variant={isListening ? "destructive" : "default"}
                >
                  {isListening ? "Stop" : "Start"} Recording
                </Button>
                <Button onClick={skipCommand} variant="outline">
                  Skip
                </Button>
              </div>
            </div>

            {transcript && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">You said:</p>
                <p className="font-medium">{transcript}</p>
              </div>
            )}
          </div>
        )}

        {trainingResults.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Training Results</h4>
              <Badge variant={accuracy >= 80 ? "default" : "destructive"}>{accuracy.toFixed(0)}% Accuracy</Badge>
            </div>

            <div className="grid gap-2">
              {currentCommands.map((command, index) => (
                <div key={index} className="flex items-center gap-3 p-2 border rounded">
                  {trainingResults[index] !== undefined ? (
                    trainingResults[index] ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )
                  ) : (
                    <div className="w-5 h-5 border-2 border-muted rounded-full" />
                  )}
                  <span className="flex-1">{command}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3 pt-4 border-t">
          <h4 className="font-medium">Add Custom Command</h4>
          <div className="flex gap-2">
            <Input
              placeholder="Enter custom command..."
              value={customCommand}
              onChange={(e) => setCustomCommand(e.target.value)}
            />
            <Button onClick={addCustomCommand} disabled={!customCommand.trim()}>
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
