"use client"

import { useEffect, useState } from "react"
import { ProductGrid } from "@/components/product-grid"
import type { Product } from "@/types/product"
import { useToast } from "@/hooks/use-toast"

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch("/api/products/featured")
        if (!response.ok) throw new Error("Failed to fetch featured products")
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        toast({
          title: "Error loading featured products",
          description: "Please try again later",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [toast])

  if (isLoading) {
    return (
      <div className="py-8">
        <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[300px] rounded-md bg-muted animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
      <ProductGrid products={products} />
    </div>
  )
}
