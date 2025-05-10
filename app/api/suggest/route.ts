import { NextResponse } from "next/server"
import { filterProducts } from "@/lib/product-data"
import { getCachedData, setCachedData, generateCacheKey } from "@/lib/api-cache"

async function getGeminiSuggestions(category: string, budget: number, features: string[], productTitles: string[]) {
  try {
    // Generate cache key
    const cacheKey = generateCacheKey({
      type: "suggestions",
      category,
      budget,
      features,
      productTitles,
    })

    // Check cache first
    const cachedResult = getCachedData<string[]>(cacheKey)
    if (cachedResult) {
      console.log("Using cached suggestions")
      return cachedResult
    }

    const API_KEY = "AIzaSyDwI267SUSomsiXOioCQZ6LnkXPLEvQuz8"
    const PROJECT_NUMBER = "105701591987"
    const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent"

    const prompt = `
      Suggest the top 5 ${category} products under ₹${budget} that have ${features.join(", ")}.
      Here are some options: ${JSON.stringify(productTitles)}.
      
      Return ONLY a JSON array of product names, nothing else. Format: ["Product 1", "Product 2", ...]
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
    const text = data.candidates[0].content.parts[0].text

    // Try to parse the JSON response
    try {
      // Extract JSON array if it's embedded in text
      const jsonMatch = text.match(/\[.*\]/s)
      let result: string[]

      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0])
      } else {
        result = JSON.parse(text)
      }

      // Cache the result
      setCachedData(cacheKey, result)

      return result
    } catch (error) {
      console.error("Failed to parse Gemini response as JSON:", error)
      return productTitles.slice(0, 5)
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error)
    return productTitles.slice(0, 5)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const shopName = body.shopName || "Stampylotta"
    const preferences = body.preferences || {}

    // Get filtered products based on preferences
    const filteredProducts = filterProducts(preferences)
    const productTitles = filteredProducts.map((p) => p.name)

    // If no products match the criteria
    if (productTitles.length === 0) {
      return NextResponse.json({
        suggestions: [],
        message: "No products match your preferences",
      })
    }

    // Get AI-suggested products
    const suggestions = await getGeminiSuggestions(
      preferences.category || "product",
      preferences.budget || 200000,
      preferences.features || [],
      productTitles,
    )

    // Map suggestions to actual product data
    const suggestedProducts = suggestions
      .map((name: string) => {
        return filteredProducts.find((p) => p.name.includes(name) || name.includes(p.name))
      })
      .filter(Boolean)

    return NextResponse.json({
      suggestions: suggestedProducts,
    })
  } catch (error) {
    console.error("Product suggestion error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate product suggestions",
      },
      { status: 500 },
    )
  }
}
