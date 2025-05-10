"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ProductCard } from "@/components/product-card"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/types/product"

export function ProductSuggestion() {
  const [category, setCategory] = useState<string>("mobile")
  const [budget, setBudget] = useState<string>("100000")
  const [features, setFeatures] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const { toast } = useToast()

  const featureOptions = {
    mobile: ["smartphone", "tablet"],
    laptop: ["gaming", "business"],
    clothing: ["casual", "formal"],
  }

  const handleFeatureToggle = (feature: string) => {
    setFeatures((prev) => (prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuggestions([])

    try {
      const response = await fetch("/api/suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shopName: "Stampylotta",
          preferences: {
            category,
            budget: Number.parseInt(budget),
            features,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get suggestions")
      }

      const data = await response.json()

      if (data.suggestions.length === 0) {
        toast({
          title: "No matches found",
          description: "No products match your preferences. Try adjusting your criteria.",
          variant: "destructive",
        })
      } else {
        setSuggestions(data.suggestions)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get product suggestions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI-Powered Product Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Product Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mobile">Mobile Devices</SelectItem>
                  <SelectItem value="laptop">Laptops</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget (₹)</Label>
              <Input
                id="budget"
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                min="1000"
                max="200000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Features</Label>
            <div className="grid grid-cols-2 gap-2">
              {category &&
                featureOptions[category as keyof typeof featureOptions]?.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature}
                      checked={features.includes(feature)}
                      onCheckedChange={() => handleFeatureToggle(feature)}
                    />
                    <Label htmlFor={feature} className="capitalize">
                      {feature}
                    </Label>
                  </div>
                ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Finding suggestions..." : "Get AI Suggestions"}
          </Button>
        </form>

        {suggestions.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Recommended Products</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestions.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
