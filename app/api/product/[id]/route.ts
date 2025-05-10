import { NextResponse } from "next/server"
import { getProductById } from "@/lib/product-data"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const product = getProductById(id)

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}
