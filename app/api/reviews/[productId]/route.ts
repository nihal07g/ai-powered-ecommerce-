import { NextResponse } from "next/server"
import { getProductReviews, addProductReview } from "@/lib/product-data"

export async function GET(request: Request, { params }: { params: { productId: string } }) {
  try {
    const productId = params.productId
    const reviews = getProductReviews(productId)
    return NextResponse.json(reviews)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { productId: string } }) {
  try {
    const productId = params.productId
    const body = await request.json()

    if (!body.name || !body.comment || !body.rating) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const newReview = addProductReview(productId, {
      name: body.name,
      comment: body.comment,
      rating: body.rating,
    })

    return NextResponse.json(newReview)
  } catch (error) {
    return NextResponse.json({ error: "Failed to add review" }, { status: 500 })
  }
}
