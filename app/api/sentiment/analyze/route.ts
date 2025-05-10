import { NextResponse } from "next/server"

// Machine learning based sentiment analysis
// This simulates the Python ML model we defined
function analyzeSentiment(text: string): string {
  // This is a simplified version of what the Python ML model would do
  // In a real app, this would call the Python API we defined

  const positiveWords = [
    "good",
    "great",
    "excellent",
    "amazing",
    "love",
    "perfect",
    "best",
    "awesome",
    "fantastic",
    "happy",
    "satisfied",
    "recommend",
    "quality",
  ]

  const negativeWords = [
    "bad",
    "poor",
    "terrible",
    "awful",
    "hate",
    "worst",
    "disappointing",
    "disappointed",
    "horrible",
    "useless",
    "waste",
    "broken",
    "refund",
  ]

  const neutralWords = [
    "okay",
    "ok",
    "fine",
    "average",
    "decent",
    "alright",
    "fair",
    "mediocre",
    "acceptable",
    "reasonable",
  ]

  const lowercaseText = text.toLowerCase()

  // Count occurrences of sentiment words
  let positiveScore = 0
  let negativeScore = 0
  let neutralScore = 0

  positiveWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "g")
    const matches = lowercaseText.match(regex)
    if (matches) positiveScore += matches.length
  })

  negativeWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "g")
    const matches = lowercaseText.match(regex)
    if (matches) negativeScore += matches.length
  })

  neutralWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "g")
    const matches = lowercaseText.match(regex)
    if (matches) neutralScore += matches.length
  })

  // Apply weights (similar to what the ML model would do)
  positiveScore *= 1.5
  negativeScore *= 2.0 // Negative words often have stronger impact

  // Determine sentiment based on scores
  if (positiveScore > negativeScore && positiveScore > neutralScore) {
    return "positive"
  } else if (negativeScore > positiveScore && negativeScore > neutralScore) {
    return "negative"
  } else {
    return "neutral"
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.text) {
      return NextResponse.json({ message: "Text is required" }, { status: 400 })
    }

    // In a production app, this would call the Python ML API
    // For this demo, we're using the JavaScript implementation
    const sentiment = analyzeSentiment(body.text)

    return NextResponse.json({ sentiment })
  } catch (error) {
    return NextResponse.json({ error: "Failed to analyze sentiment" }, { status: 500 })
  }
}
