import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export function CategorySection() {
  const categories = [
    {
      name: "Mobile",
      image: "/placeholder.svg?height=300&width=300&query=smartphone+collection+display",
      link: "/category/mobile",
    },
    {
      name: "Laptop",
      image: "/placeholder.svg?height=300&width=300&query=laptop+collection+display",
      link: "/category/laptop",
    },
    {
      name: "Clothing",
      image: "/placeholder.svg?height=300&width=300&query=fashion+clothing+collection",
      link: "/category/clothing",
    },
  ]

  return (
    <section className="py-8">
      <h2 className="text-3xl font-bold mb-6">Shop by Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link key={category.name} href={category.link}>
            <Card className="overflow-hidden transition-all hover:shadow-lg">
              <CardContent className="p-0">
                <div className="aspect-square relative">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <h3 className="text-white text-2xl font-bold">{category.name}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
