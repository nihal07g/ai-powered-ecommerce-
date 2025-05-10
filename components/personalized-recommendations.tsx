"use client"

import { useEffect, useState } from "react"
import { ProductGrid } from "@/components/product-grid"
import type { Product } from "@/types/product"
import { useToast } from "@/hooks/use-toast"

export function PersonalizedRecommendations() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchPersonalizedRecommendations = async () => {
      try {
        // Get browsing history from localStorage
        const viewHistory = JSON.parse(localStorage.getItem("viewHistory") || "[]")

        if (viewHistory.length === 0) {
          // If no browsing history, show featured products instead
          const response = await fetch("/api/products/featured")
          if (!response.ok) throw new Error("Failed to fetch featured products")
          const data = await response.json()
          setProducts(data)
          return
        }

        // Get personalized recommendations based on browsing history
        const response = await fetch("/api/recommend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            viewHistory,
          }),
        })

        if (!response.ok) throw new Error("Failed to fetch recommendations")

        const data = await response.json()
        setProducts(data.recommendations)
      } catch (error) {
        toast({
          title: "Error loading recommendations",
          description: "Please try again later",
          variant: "destructive",
        })

        // Fallback to featured products
        try {
          const response = await fetch("/api/products/featured")
          if (response.ok) {
            const data = await response.json()
            setProducts(data)
          }
        } catch (e) {
          console.error("Failed to fetch fallback products:", e)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchPersonalizedRecommendations()
  }, [toast])

  if (isLoading) {
    return (
      <div className="py-8">
        <h2 className="text-3xl font-bold mb-6">Recommended For You</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[300px] rounded-md bg-muted animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold mb-6">Recommended For You</h2>
      <ProductGrid products={products} />
    </div>
  )
}
