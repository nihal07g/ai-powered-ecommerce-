"use client"

import { useEffect } from "react"
import { getProductById, getProductReviews } from "@/lib/product-data"
import { ReviewList } from "@/components/review-list"
import { ReviewForm } from "@/components/review-form"
import { notFound } from "next/navigation"
import { formatPrice } from "@/lib/utils"
import AddToCartButton from "./add-to-cart-button"
import BuyNowButton from "./buy-now-button"
import { ProductDetailSummary } from "@/components/product-detail-summary"
import { trackProductView } from "@/lib/track-product-view"

export default function ProductPage({ params }: { params: { id: string } }) {
  const productId = params.id
  const product = getProductById(productId)
  const reviews = getProductReviews(productId)

  // Track product view
  useEffect(() => {
    if (product) {
      trackProductView(productId)
    }
  }, [productId, product])

  if (!product) {
    notFound()
  }

  return (
    <div className="container py-8">
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-muted rounded-lg overflow-hidden">
          <img
            src={product.image || `/placeholder.svg?height=600&width=600&query=${encodeURIComponent(product.name)}`}
            alt={product.name}
            className="w-full h-auto object-cover aspect-square"
          />
        </div>

        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-xl font-bold mt-2 text-primary">{formatPrice(product.price)}</p>

          <div className="mt-4 text-muted-foreground">
            <p>
              Category: <span className="capitalize">{product.category}</span>
            </p>
            {product.type && (
              <p>
                Type: <span className="capitalize">{product.type}</span>
              </p>
            )}
            {product.color && (
              <p>
                Color: <span className="capitalize">{product.color}</span>
              </p>
            )}
            {product.brand && (
              <p>
                Brand: <span className="capitalize">{product.brand}</span>
              </p>
            )}
            {product.stock !== undefined && (
              <p className="mt-2">
                Availability:
                <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                  {product.stock > 0 ? ` In Stock (${product.stock} available)` : " Out of Stock"}
                </span>
              </p>
            )}
          </div>

          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p>{product.description}</p>
          </div>

          <div className="mt-8 flex gap-4">
            <AddToCartButton product={product} />
            <BuyNowButton product={product} />
          </div>
        </div>
      </div>

      <div className="mt-8 mb-12">
        <ProductDetailSummary productId={productId} />
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <ReviewList reviews={reviews} />
          <ReviewForm
            productId={productId}
            onReviewAdded={(newReview) => {
              // In a client component, this would update the UI
              // For server components, we'd need a different approach
              window.location.reload()
            }}
          />
        </div>
      </div>
    </div>
  )
}
