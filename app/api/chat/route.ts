import { NextResponse } from "next/server"

// Gemini API integration with updated API key and project number
async function getGeminiResponse(message: string, history = "") {
  try {
    const API_KEY = "AIzaSyDwI267SUSomsiXOioCQZ6LnkXPLEvQuz8"
    const PROJECT_NUMBER = "105701591987"
    const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent"

    const prompt = `You are a helpful shopping assistant for Stampylotta, an e-commerce website that sells mobile phones, laptops, and clothing in India. 
    Prices are in INR. Be helpful, friendly, and concise in your responses.
    
    ${history ? `Previous conversation:\n${history}\n\n` : ""}
    
    User message: ${message}`

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-user-project": PROJECT_NUMBER.toString(),
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 200,
        },
      }),
    })

    if (!response.ok) {
      console.error(`Gemini API error: ${response.status} - ${await response.text()}`)
      return getBackupResponse(message)
    }

    const data = await response.json()

    // Check if the response has the expected structure
    if (
      !data.candidates ||
      !data.candidates[0] ||
      !data.candidates[0].content ||
      !data.candidates[0].content.parts ||
      !data.candidates[0].content.parts[0]
    ) {
      console.error("Unexpected Gemini API response structure:", JSON.stringify(data))
      return getBackupResponse(message)
    }

    return data.candidates[0].content.parts[0].text
  } catch (error) {
    console.error("Gemini API error:", error)
    return getBackupResponse(message)
  }
}

// Backup responses if the API fails
function getBackupResponse(message: string): string {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
    return "Hello! Welcome to Stampylotta. How can I help you today?"
  }

  if (lowerMessage.includes("price") || lowerMessage.includes("cost")) {
    return "Our products range from ₹1,999 for clothing items to ₹189,999 for premium laptops. Can I help you find something specific?"
  }

  if (lowerMessage.includes("phone") || lowerMessage.includes("mobile")) {
    return "We have the latest iPhones starting at ₹74,999 and Samsung Galaxy phones from ₹59,999. Would you like more details?"
  }

  if (lowerMessage.includes("laptop")) {
    return "Our laptop collection includes MacBooks from ₹189,999 and gaming laptops starting at ₹114,999."
  }

  if (lowerMessage.includes("clothing")) {
    return "We offer casual t-shirts from ₹1,999 and formal dresses starting at ₹6,999."
  }

  return "I'm here to help with your shopping at Stampylotta. Feel free to ask about our mobile phones, laptops, or clothing collection."
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.message) {
      return NextResponse.json({ message: "Message is required" }, { status: 400 })
    }

    // Get response from Gemini API or fallback
    const response = await getGeminiResponse(body.message, body.history || "")

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Chat error:", error)
    // Always return a 200 status with a fallback message to prevent UI errors
    return NextResponse.json(
      {
        response: "I'm here to help with your shopping at Stampylotta. How can I assist you today?",
      },
      { status: 200 },
    )
  }
}
