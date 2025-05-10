"use client"

import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import { Minus, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart()
  const { toast } = useToast()

  const handleCheckout = () => {
    toast({
      title: "Checkout Successful",
      description: "Thank you for your purchase! This is a demo checkout.",
    })
    clearCart()
  }

  if (cart.length === 0) {
    return (
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-6">Your cart is empty</p>
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cart.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-muted rounded-md overflow-hidden">
                    <img
                      src={item.image || "/placeholder.svg?height=100&width=100"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <Link href={`/product/${item.id}`} className="font-medium hover:underline">
                      {item.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-r-none"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <div className="h-8 px-3 flex items-center justify-center border-y">{item.quantity}</div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-l-none"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatPrice(item.price)}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.quantity > 1 && `${item.quantity} × ${formatPrice(item.price / item.quantity)}`}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{totalPrice > 50 ? "Free" : formatPrice(5.99)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatPrice(totalPrice * 0.08)}</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold">
                <span>Total</span>
                <span>{formatPrice(totalPrice + (totalPrice > 50 ? 0 : 5.99) + totalPrice * 0.08)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleCheckout}>
                Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
