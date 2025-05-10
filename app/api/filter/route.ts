import { NextResponse } from "next/server"
import { filterProducts } from "@/lib/product-data"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || undefined
    const type = searchParams.get("type") || undefined
    const color = searchParams.get("color") || undefined

    const products = filterProducts({ category, type, color })
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: "Failed to filter products" }, { status: 500 })
  }
}
