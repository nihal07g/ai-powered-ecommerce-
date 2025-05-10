"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/types/product"
import { useRouter } from "next/navigation"

export default function BuyNowButton({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const router = useRouter()

  const handleBuyNow = () => {
    addToCart(product)
    toast({
      title: "Proceeding to checkout",
      description: `${product.name} has been added to your cart`,
    })
    router.push("/cart")
  }

  return (
    <Button onClick={handleBuyNow} variant="outline" className="flex-1">
      Buy Now
    </Button>
  )
}
