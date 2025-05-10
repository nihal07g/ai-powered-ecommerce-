import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { Product } from "@/types/product"
import { formatPrice } from "@/lib/utils"

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link key={product.id} href={`/product/${product.id}`}>
          <Card className="h-full overflow-hidden transition-all hover:shadow-lg">
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
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
              <span className="font-bold">{formatPrice(product.price)}</span>
              <div className="text-sm text-muted-foreground">{product.category}</div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}
