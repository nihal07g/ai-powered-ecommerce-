"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/types/product"
import { ShoppingCart } from "lucide-react"

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleAddToCart = () => {
    addToCart(product)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    })
  }

  return (
    <Button onClick={handleAddToCart} className="flex-1">
      <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
    </Button>
  )
}
