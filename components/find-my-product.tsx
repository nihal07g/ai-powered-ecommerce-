"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductGrid } from "@/components/product-grid"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/types/product"

export function FindMyProduct() {
  const [category, setCategory] = useState("")
  const [type, setType] = useState("")
  const [color, setColor] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleFindProducts = async () => {
    if (!category) {
      toast({
        title: "Please select a category",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const queryParams = new URLSearchParams()
      if (category) queryParams.append("category", category)
      if (type) queryParams.append("type", type)
      if (color) queryParams.append("color", color)

      const response = await fetch(`/api/filter?${queryParams.toString()}`)
      if (!response.ok) throw new Error("Failed to fetch filtered products")

      const data = await response.json()
      setFilteredProducts(data)
    } catch (error) {
      toast({
        title: "Error finding products",
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
        <CardTitle>Find My Product</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="laptop">Laptop</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="smartphone">Smartphone</SelectItem>
                <SelectItem value="tablet">Tablet</SelectItem>
                <SelectItem value="gaming">Gaming</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger>
                <SelectValue placeholder="Color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="black">Black</SelectItem>
                <SelectItem value="white">White</SelectItem>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="red">Red</SelectItem>
                <SelectItem value="green">Green</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleFindProducts} disabled={isLoading}>
            {isLoading ? "Finding..." : "Find Products"}
          </Button>
        </div>

        {filteredProducts.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Results ({filteredProducts.length})</h3>
            <ProductGrid products={filteredProducts} />
          </div>
        )}

        {filteredProducts.length === 0 && category && !isLoading && (
          <p className="text-center text-muted-foreground py-8">
            No products match your criteria. Try different options.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
