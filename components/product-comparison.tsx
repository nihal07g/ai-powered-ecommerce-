"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/types/product"
import { formatPrice } from "@/lib/utils"

interface ProductComparisonProps {
  products: Product[]
}

export function ProductComparison({ products }: ProductComparisonProps) {
  const [product1Id, setProduct1Id] = useState<string>("")
  const [product2Id, setProduct2Id] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [comparisonResult, setComparisonResult] = useState<string>("")
  const { toast } = useToast()

  const handleCompare = async () => {
    if (!product1Id || !product2Id) {
      toast({
        title: "Please select two products to compare",
        variant: "destructive",
      })
      return
    }

    if (product1Id === product2Id) {
      toast({
        title: "Please select different products",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setComparisonResult("")

    try {
      const product1 = products.find((p) => p.id === product1Id)
      const product2 = products.find((p) => p.id === product2Id)

      if (!product1 || !product2) {
        throw new Error("Products not found")
      }

      const response = await fetch("/api/compare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product1,
          product2,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to compare products")
      }

      const data = await response.json()
      setComparisonResult(data.comparison)
    } catch (error) {
      toast({
        title: "Error comparing products",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Product Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Select value={product1Id} onValueChange={setProduct1Id}>
              <SelectTrigger>
                <SelectValue placeholder="Select first product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} - {formatPrice(product.price)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={product2Id} onValueChange={setProduct2Id}>
              <SelectTrigger>
                <SelectValue placeholder="Select second product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} - {formatPrice(product.price)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleCompare} className="w-full" disabled={isLoading}>
          {isLoading ? "Comparing..." : "Compare Products"}
        </Button>

        {comparisonResult && (
          <div className="mt-6 p-4 bg-muted rounded-md">
            <h3 className="text-lg font-medium mb-2">Comparison Results</h3>
            <div className="whitespace-pre-line">{comparisonResult}</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
