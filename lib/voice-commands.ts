// Voice command processing and action handlers
export interface VoiceAction {
  type: string
  payload?: any
}

export class VoiceCommandProcessor {
  private commandHistory: string[] = []
  private maxHistorySize = 50

  // Process voice command and return action
  processCommand(transcript: string, language: string): VoiceAction | null {
    const normalizedTranscript = transcript.toLowerCase().trim()
    this.addToHistory(normalizedTranscript)

    // Command patterns for different languages
    const commandPatterns = this.getCommandPatterns(language)

    for (const pattern of commandPatterns) {
      if (this.matchesPattern(normalizedTranscript, pattern.patterns)) {
        return {
          type: pattern.action,
          payload: pattern.extractParams ? pattern.extractParams(normalizedTranscript) : undefined,
        }
      }
    }

    return null
  }

  private getCommandPatterns(language: string) {
    const patterns = {
      "en-US": [
        {
          action: "ADD_BATCH",
          patterns: ["add new batch", "create batch", "new batch", "add batch"],
        },
        {
          action: "SHOW_HISTORY",
          patterns: ["show history", "view history", "batch history", "my batches"],
        },
        {
          action: "GENERATE_QR",
          patterns: ["generate qr", "create qr", "qr code", "make qr"],
        },
        {
          action: "UPLOAD_PHOTO",
          patterns: ["upload photo", "add photo", "take photo", "camera"],
        },
        {
          action: "CHECK_STATUS",
          patterns: ["check status", "batch status", "status"],
          extractParams: (text: string) => {
            const batchMatch = text.match(/batch\s+(\w+)/i)
            return batchMatch ? { batchId: batchMatch[1] } : undefined
          },
        },
        {
          action: "SEARCH_BATCH",
          patterns: ["search", "find batch", "search batch"],
          extractParams: (text: string) => {
            const searchTerms = text.replace(/search|find|batch/gi, "").trim()
            return searchTerms ? { query: searchTerms } : undefined
          },
        },
        {
          action: "NAVIGATE_TO",
          patterns: ["go to", "open", "navigate to"],
          extractParams: (text: string) => {
            if (text.includes("dashboard")) return { page: "dashboard" }
            if (text.includes("profile")) return { page: "profile" }
            if (text.includes("settings")) return { page: "settings" }
            return undefined
          },
        },
      ],
      "hi-IN": [
        {
          action: "ADD_BATCH",
          patterns: ["नई बैच जोड़ो", "बैच बनाओ", "नया बैच", "बैच जोड़ें"],
        },
        {
          action: "SHOW_HISTORY",
          patterns: ["इतिहास दिखाओ", "बैच इतिहास", "मेरे बैच", "पुराने बैच"],
        },
        {
          action: "GENERATE_QR",
          patterns: ["क्यूआर बनाओ", "क्यूआर कोड", "क्यूआर जेनरेट करो"],
        },
        {
          action: "UPLOAD_PHOTO",
          patterns: ["फोटो अपलोड करो", "तस्वीर जोड़ो", "फोटो लो", "कैमरा"],
        },
        {
          action: "CHECK_STATUS",
          patterns: ["स्थिति जांचो", "बैच स्थिति", "स्टेटस देखो"],
        },
        {
          action: "SEARCH_BATCH",
          patterns: ["खोजो", "बैच ढूंढो", "सर्च करो"],
        },
        {
          action: "NAVIGATE_TO",
          patterns: ["जाओ", "खोलो", "दिखाओ"],
          extractParams: (text: string) => {
            if (text.includes("डैशबोर्ड")) return { page: "dashboard" }
            if (text.includes("प्रोफाइल")) return { page: "profile" }
            if (text.includes("सेटिंग")) return { page: "settings" }
            return undefined
          },
        },
      ],
      "mr-IN": [
        {
          action: "ADD_BATCH",
          patterns: ["नवीन बॅच जोडा", "बॅच तयार करा", "नवा बॅच"],
        },
        {
          action: "SHOW_HISTORY",
          patterns: ["इतिहास दाखवा", "बॅच इतिहास", "माझे बॅच"],
        },
        {
          action: "GENERATE_QR",
          patterns: ["क्यूआर तयार करा", "क्यूआर कोड", "क्यूआर बनवा"],
        },
        {
          action: "UPLOAD_PHOTO",
          patterns: ["फोटो अपलोड करा", "छायाचित्र जोडा", "फोटो काढा"],
        },
        {
          action: "CHECK_STATUS",
          patterns: ["स्थिती तपासा", "बॅच स्थिती", "स्टेटस पहा"],
        },
      ],
      "ta-IN": [
        {
          action: "ADD_BATCH",
          patterns: ["புதிய தொகுப்பு சேர்க்கவும்", "தொகுப்பு உருவாக்கு", "புதிய தொகுப்பு"],
        },
        {
          action: "SHOW_HISTORY",
          patterns: ["வரலாறு காட்டு", "தொகுப்பு வரலாறு", "என் தொகுப்புகள்"],
        },
        {
          action: "GENERATE_QR",
          patterns: ["க்யூஆர் உருவாக்கு", "க்யூஆர் குறியீடு", "க்யூஆர் செய்"],
        },
        {
          action: "UPLOAD_PHOTO",
          patterns: ["புகைப்படம் பதிவேற்று", "படம் சேர்", "புகைப்படம் எடு"],
        },
        {
          action: "CHECK_STATUS",
          patterns: ["நிலையை சரிபார்க்கவும்", "தொகுப்பு நிலை", "ஸ்டேட்டஸ் பார்"],
        },
      ],
    }

    return patterns[language as keyof typeof patterns] || patterns["en-US"]
  }

  private matchesPattern(transcript: string, patterns: string[]): boolean {
    return patterns.some(
      (pattern) => transcript.includes(pattern.toLowerCase()) || this.fuzzyMatch(transcript, pattern.toLowerCase()),
    )
  }

  private fuzzyMatch(text: string, pattern: string, threshold = 0.7): boolean {
    const distance = this.levenshteinDistance(text, pattern)
    const maxLength = Math.max(text.length, pattern.length)
    const similarity = 1 - distance / maxLength
    return similarity >= threshold
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1)
      .fill(null)
      .map(() => Array(str1.length + 1).fill(null))

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
        matrix[j][i] = Math.min(matrix[j][i - 1] + 1, matrix[j - 1][i] + 1, matrix[j - 1][i - 1] + indicator)
      }
    }

    return matrix[str2.length][str1.length]
  }

  private addToHistory(command: string) {
    this.commandHistory.unshift(command)
    if (this.commandHistory.length > this.maxHistorySize) {
      this.commandHistory.pop()
    }
  }

  getCommandHistory(): string[] {
    return [...this.commandHistory]
  }

  getCommandSuggestions(language: string): string[] {
    const patterns = this.getCommandPatterns(language)
    return patterns.flatMap((pattern) => pattern.patterns)
  }
}

// Singleton instance
export const voiceCommandProcessor = new VoiceCommandProcessor()
