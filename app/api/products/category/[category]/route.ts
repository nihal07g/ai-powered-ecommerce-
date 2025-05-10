import { NextResponse } from "next/server"
import { getProductsByCategory } from "@/lib/product-data"

export async function GET(request: Request, { params }: { params: { category: string } }) {
  try {
    const category = params.category
    const products = getProductsByCategory(category)

    if (products.length === 0) {
      return NextResponse.json({ message: "No products found in this category" }, { status: 404 })
    }

    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
