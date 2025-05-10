import { NextResponse } from "next/server"
import { searchProducts } from "@/lib/product-data"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query) {
      return NextResponse.json({ message: "Search query is required" }, { status: 400 })
    }

    const products = searchProducts(query)
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: "Failed to search products" }, { status: 500 })
  }
}
