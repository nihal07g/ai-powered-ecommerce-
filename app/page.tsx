import { CategorySection } from "@/components/category-section"
import { HeroSection } from "@/components/hero-section"
import { FeaturedProducts } from "@/components/featured-products"
import { ProductSuggestion } from "@/components/product-suggestion"
import { PersonalizedRecommendations } from "@/components/personalized-recommendations"

export default function Home() {
  return (
    <div className="flex flex-col gap-8 pb-8">
      <HeroSection />
      <div className="container">
        <CategorySection />
        <div className="my-8">
          <PersonalizedRecommendations />
        </div>
        <div className="my-8">
          <ProductSuggestion />
        </div>
        <div className="my-8">
          <FeaturedProducts />
        </div>
      </div>
    </div>
  )
}
