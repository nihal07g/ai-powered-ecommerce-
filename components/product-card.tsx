"use client"

import type React from "react"

import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Product } from "@/types/product"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/hooks/use-toast"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    })
  }

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
    toast({
      title: "Proceeding to checkout",
      description: `${product.name} has been added to your cart`,
    })
    // In a real app, we would redirect to checkout
    // window.location.href = '/checkout'
  }

  return (
    <Card className="h-full overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/product/${product.id}`}>
        <div className="aspect-square relative">
          <img
            src={product.image || "/placeholder.svg?height=300&width=300"}
            alt={product.name}
            className="object-cover w-full h-full"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium line-clamp-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{product.description}</p>
          <div className="mt-2 font-bold">{formatPrice(product.price)}</div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" className="w-full" onClick={handleAddToCart}>
          Add to Cart
        </Button>
        <Button className="w-full" onClick={handleBuyNow}>
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  )
}
