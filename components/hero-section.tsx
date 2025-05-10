import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-gray-900 to-gray-800">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Welcome to Stampylotta
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Discover the perfect products with our intelligent shopping experience. AI-powered recommendations and
                machine learning enhanced search.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/category/mobile">
                <Button size="lg">Shop Mobile</Button>
              </Link>
              <Link href="/category/laptop">
                <Button size="lg" variant="outline">
                  Shop Laptop
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img
              alt="Hero Image"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              height="550"
              src="/placeholder.svg?height=550&width=550&query=ecommerce+shopping+technology+products"
              width="550"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
