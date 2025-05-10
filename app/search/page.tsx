"use client"

import { searchProducts } from "@/lib/product-data"
import { ProductCard } from "@/components/product-card"
import { useSearchParams } from "next/navigation"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const products = query ? searchProducts(query) : []

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">Search Results</h1>
      <p className="text-muted-foreground mb-6">
        {products.length} results for "{query}"
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => <ProductCard key={product.id} product={product} />)
        ) : (
          <p className="col-span-full text-center py-12 text-muted-foreground">
            No products found matching your search. Try different keywords.
          </p>
        )}
      </div>
    </div>
  )
}
