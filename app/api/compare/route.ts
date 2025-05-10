import { NextResponse } from "next/server"
import type { Product } from "@/types/product"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { product1, product2 } = body

    if (!product1 || !product2) {
      return NextResponse.json({ message: "Two products are required" }, { status: 400 })
    }

    // Call Gemini API to compare products
    const comparison = await compareProductsWithGemini(product1, product2)

    return NextResponse.json({ comparison })
  } catch (error) {
    console.error("Product comparison error:", error)
    return NextResponse.json(
      {
        error: "Failed to compare products",
      },
      { status: 500 },
    )
  }
}

async function compareProductsWithGemini(product1: Product, product2: Product) {
  try {
    const API_KEY = "AIzaSyDwI267SUSomsiXOioCQZ6LnkXPLEvQuz8"
    const PROJECT_NUMBER = "105701591987"
    const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent"

    const prompt = `
      Compare these two products:
      
      Product 1: ${product1.name}
      Description: ${product1.description}
      Price: ₹${product1.price}
      Category: ${product1.category}
      Type: ${product1.type || "N/A"}
      
      Product 2: ${product2.name}
      Description: ${product2.description}
      Price: ₹${product2.price}
      Category: ${product2.category}
      Type: ${product2.type || "N/A"}
      
      Provide a detailed comparison including:
      1. Key differences
      2. Price-to-value analysis
      3. Which product is better for different use cases
      4. Final recommendation
      
      Format your response in clear sections with headings.
    `

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
          temperature: 0.2,
          maxOutputTokens: 1024,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    return data.candidates[0].content.parts[0].text
  } catch (error) {
    console.error("Error calling Gemini API for product comparison:", error)
    return `We couldn't generate a comparison at this time. Here's a basic comparison:

## Key Differences
- ${product1.name} costs ₹${product1.price}, while ${product2.name} costs ₹${product2.price}
- ${product1.name} is in the ${product1.category} category, and ${product2.name} is in the ${product2.category} category

Please try again later for a more detailed comparison.`
  }
}
