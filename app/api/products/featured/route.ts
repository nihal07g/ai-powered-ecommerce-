import { NextResponse } from "next/server"
import { getFeaturedProducts } from "@/lib/product-data"

export async function GET() {
  try {
    const products = getFeaturedProducts()
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch featured products" }, { status: 500 })
  }
}
