import { NextResponse } from "next/server"
import { getProductById, getAllProducts } from "@/lib/product-data"
import { getCachedData, generateCacheKey } from "@/lib/api-cache"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const viewHistory = body.viewHistory || []
    const products = getAllProducts()

    if (viewHistory.length === 0) {
      // If no view history, return featured products
      const featuredProducts = products.slice(0, 4)
      return NextResponse.json({ recommendations: featuredProducts })
    }

    // Get the viewed products
    const viewedProducts = viewHistory.map((id: string) => getProductById(id)).filter(Boolean)

    if (viewedProducts.length === 0) {
      // If no valid products in history, return featured products
      const featuredProducts = products.slice(0, 4)
      return NextResponse.json({ recommendations: featuredProducts })
    }

    // Generate cache key
    const cacheKey = generateCacheKey({
      type: "recommendations",
      viewHistory,
    })

    // Check cache first
    const cachedRecommendations = getCachedData<string[]>(cacheKey)
    if (cachedRecommendations) {
      console.log("Using cached recommendations")
      const recommendedProducts = cachedRecommendations.map((id) => getProductById(id)).filter(Boolean)
      return NextResponse.json({ recommendations: recommendedProducts })
    }

    // Simple recommendation logic: recommend products in the same category
    const recentProduct = viewedProducts[0]
    const recommendedProducts = products
      .filter((p) => p.category === recentProduct.category && !viewHistory.includes(p.id))
      .slice(0, 4)

    // If we don't have enough recommendations, add some from other categories
    if (recommendedProducts.length < 4) {
      const otherProducts = products
        .filter((p) => p.category !== recentProduct.category && !viewHistory.includes(p.id))
        .slice(0, 4 - recommendedProducts.length)

      recommendedProducts.push(...otherProducts)
    }

    return NextResponse.json({ recommendations: recommendedProducts })
  } catch (error) {
    console.error("Recommendation error:", error)
    // Fallback to featured products
    const featuredProducts = getAllProducts().slice(0, 4)
    return NextResponse.json({ recommendations: featuredProducts })
  }
}
