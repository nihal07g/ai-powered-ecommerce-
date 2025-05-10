import { NextResponse } from "next/server"
import { getAllProducts } from "@/lib/product-data"

export async function GET() {
  try {
    const products = getAllProducts()
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
