"use client"

import type React from "react"

import Link from "next/link"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Header() {
  const { cart } = useCart()
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Stampylotta</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/category/mobile" className="text-sm font-medium transition-colors hover:text-primary">
              Mobile
            </Link>
            <Link href="/category/laptop" className="text-sm font-medium transition-colors hover:text-primary">
              Laptop
            </Link>
            <Link href="/category/clothing" className="text-sm font-medium transition-colors hover:text-primary">
              Clothing
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="hidden md:flex relative w-full max-w-sm items-center">
            <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
