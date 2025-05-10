"use client"

import { getProductsByCategory } from "@/lib/product-data"
import { ProductCard } from "@/components/product-card"
import { ProductComparison } from "@/components/product-comparison"
import { useParams } from "next/navigation"

export default function CategoryPage() {
  const params = useParams()
  const category = params.category as string
  const products = getProductsByCategory(category)

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6 capitalize">{category}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => <ProductCard key={product.id} product={product} />)
        ) : (
          <p className="col-span-full text-center py-12 text-muted-foreground">No products found in this category.</p>
        )}
      </div>

      {products.length >= 2 && (
        <div className="mt-12">
          <ProductComparison products={products} />
        </div>
      )}
    </div>
  )
}
