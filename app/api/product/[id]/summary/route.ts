import { NextResponse } from "next/server"
import { getProductById, getProductSummary } from "@/lib/product-data"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const productId = params.id
    const product = getProductById(productId)

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    // Check if we have local summary data
    const localSummary = getProductSummary(productId)
    if (localSummary) {
      return NextResponse.json(localSummary)
    }

    // If no local data, generate with Gemini API
    const GEMINI_API_KEY = "AIzaSyDwI267SUSomsiXOioCQZ6LnkXPLEvQuz8"
    const PROJECT_NUMBER = "105701591987"

    const prompt = `
      Product Name: ${product.name}
      Product Description: ${product.description}
      
      Please provide:
      1. A concise summary of this product (2-3 sentences)
      2. Key features (as a JSON array)
      3. Pros and cons (as JSON objects with arrays)
      4. Best use cases (as a JSON array)
      
      Format the response as valid JSON with the following structure:
      {
          "summary": "string",
          "features": ["feature1", "feature2", ...],
          "pros": ["pro1", "pro2", ...],
          "cons": ["con1", "con2", ...],
          "useCases": ["useCase1", "useCase2", ...]
      }
    `

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-user-project": PROJECT_NUMBER,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1024,
          },
        }),
      },
    )

    if (!response.ok) {
      return NextResponse.json({ message: "Failed to generate AI summary" }, { status: 500 })
    }

    const data = await response.json()
    const text = data.candidates[0].content.parts[0].text

    // Extract JSON from response
    const jsonMatch = text.match(/({.*})/s)
    if (!jsonMatch) {
      return NextResponse.json({ message: "Failed to parse AI response" }, { status: 500 })
    }

    const aiData = JSON.parse(jsonMatch[1])
    return NextResponse.json(aiData)
  } catch (error) {
    console.error("Error generating product summary:", error)
    return NextResponse.json({ error: "Failed to generate product summary" }, { status: 500 })
  }
}
