import type { Product, Review } from "@/types/product"
import { generateId } from "@/lib/utils"

// Update product prices to INR (roughly 75x USD for conversion)
export const products: Product[] = [
  {
    id: "1",
    name: "iPhone 13 Pro",
    description:
      "Apple iPhone 13 Pro with A15 Bionic chip, Pro camera system, and Super Retina XDR display with ProMotion.",
    price: 74999,
    category: "mobile",
    type: "smartphone",
    color: "graphite",
    image: "/iphone-13-pro.png",
    stock: 50,
  },
  {
    id: "2",
    name: "Samsung Galaxy S21",
    description: "Samsung Galaxy S21 with Exynos 2100 processor, 8GB RAM, and Dynamic AMOLED 2X display.",
    price: 59999,
    category: "mobile",
    type: "smartphone",
    color: "black",
    image: "/samsung-galaxy-s21.png",
    stock: 35,
  },
  {
    id: "3",
    name: 'MacBook Pro 16"',
    description:
      "Apple MacBook Pro with M1 Pro chip, 16-inch Liquid Retina XDR display, and up to 32GB unified memory.",
    price: 189999,
    category: "laptop",
    type: "business",
    color: "silver",
    image: "/space-grey-macbook-pro-16.png",
    stock: 20,
  },
  {
    id: "4",
    name: "Dell XPS 15",
    description:
      "Dell XPS 15 with 11th Gen Intel Core processors, NVIDIA GeForce RTX graphics, and InfinityEdge display.",
    price: 134999,
    category: "laptop",
    type: "business",
    color: "silver",
    image: "/dell-xps-15.png",
    stock: 15,
  },
  {
    id: "5",
    name: "Men's Casual T-Shirt",
    description: "Comfortable cotton t-shirt for everyday wear. Machine washable and available in multiple sizes.",
    price: 1999,
    category: "clothing",
    type: "casual",
    color: "blue",
    image: "/mens-blue-casual-tshirt.png",
    stock: 100,
  },
  {
    id: "6",
    name: "Women's Formal Dress",
    description: "Elegant formal dress for special occasions. Made with high-quality fabric and modern design.",
    price: 6999,
    category: "clothing",
    type: "formal",
    color: "black",
    image: "/womens-black-formal-dress.png",
    stock: 30,
  },
  {
    id: "7",
    name: "iPad Air",
    description: "Apple iPad Air with M1 chip, 10.9-inch Liquid Retina display, and all-day battery life.",
    price: 44999,
    category: "mobile",
    type: "tablet",
    color: "blue",
    image: "/placeholder.svg?key=7bxeq",
    stock: 40,
  },
  {
    id: "8",
    name: "ASUS ROG Gaming Laptop",
    description: "ASUS ROG gaming laptop with NVIDIA GeForce RTX graphics, high-refresh display, and RGB keyboard.",
    price: 114999,
    category: "laptop",
    type: "gaming",
    color: "black",
    image: "/placeholder.svg?key=2w1rx",
    stock: 25,
  },
  {
    id: "9",
    name: "OnePlus 10 Pro",
    description: "OnePlus 10 Pro with Snapdragon 8 Gen 1, Hasselblad camera system, and 120Hz AMOLED display.",
    price: 66999,
    category: "mobile",
    type: "smartphone",
    color: "green",
    image: "/placeholder.svg?height=300&width=300&query=oneplus+10+pro",
    stock: 45,
  },
  {
    id: "10",
    name: "HP Spectre x360",
    description: "HP Spectre x360 with Intel Evo platform, 4K OLED display, and 360-degree hinge for versatile use.",
    price: 129999,
    category: "laptop",
    type: "business",
    color: "gold",
    image: "/placeholder.svg?height=300&width=300&query=hp+spectre+x360",
    stock: 18,
  },
  {
    id: "11",
    name: "Men's Denim Jeans",
    description: "Classic denim jeans with comfortable fit. Durable material and timeless style.",
    price: 2999,
    category: "clothing",
    type: "casual",
    color: "blue",
    image: "/placeholder.svg?height=300&width=300&query=mens+denim+jeans",
    stock: 80,
  },
  {
    id: "12",
    name: "Women's Running Shoes",
    description: "Lightweight running shoes with responsive cushioning and breathable mesh upper.",
    price: 4999,
    category: "clothing",
    type: "casual",
    color: "pink",
    image: "/placeholder.svg?height=300&width=300&query=womens+running+shoes+pink",
    stock: 60,
  },
]

// Sample reviews data
export const reviews: { [productId: string]: Review[] } = {
  "1": [
    {
      id: "101",
      name: "John Doe",
      comment: "Amazing phone! The camera quality is outstanding and the battery life is impressive.",
      rating: 5,
      date: "2023-05-15T10:30:00Z",
      sentiment: "positive",
    },
    {
      id: "102",
      name: "Jane Smith",
      comment: "Great phone overall, but I wish it had a better battery life.",
      rating: 4,
      date: "2023-06-20T14:45:00Z",
      sentiment: "neutral",
    },
    {
      id: "103",
      name: "Mike Johnson",
      comment: "The price is too high for what it offers. Not worth it.",
      rating: 2,
      date: "2023-07-05T09:15:00Z",
      sentiment: "negative",
    },
    {
      id: "104",
      name: "Sarah Williams",
      comment: "Perfect upgrade from my old iPhone. Loving the new features!",
      rating: 5,
      date: "2023-08-12T16:20:00Z",
      sentiment: "positive",
    },
  ],
  "2": [
    {
      id: "201",
      name: "Robert Brown",
      comment: "Excellent Android phone with great performance and display.",
      rating: 5,
      date: "2023-04-10T11:25:00Z",
      sentiment: "positive",
    },
    {
      id: "202",
      name: "Emily Davis",
      comment: "Good phone but heats up sometimes during gaming.",
      rating: 3,
      date: "2023-05-22T13:40:00Z",
      sentiment: "neutral",
    },
    {
      id: "203",
      name: "David Wilson",
      comment: "Camera quality is not as good as advertised.",
      rating: 2,
      date: "2023-06-30T15:55:00Z",
      sentiment: "negative",
    },
    {
      id: "204",
      name: "Lisa Taylor",
      comment: "Fast charging and great display! Very satisfied with my purchase.",
      rating: 4,
      date: "2023-07-18T10:10:00Z",
      sentiment: "positive",
    },
  ],
  "3": [
    {
      id: "301",
      name: "Alex Johnson",
      comment: "The M1 Pro chip is incredibly fast. Perfect for my design work.",
      rating: 5,
      date: "2023-03-15T09:30:00Z",
      sentiment: "positive",
    },
    {
      id: "302",
      name: "Emma Wilson",
      comment: "Great laptop but quite expensive. Still worth it for professionals.",
      rating: 4,
      date: "2023-04-22T14:15:00Z",
      sentiment: "neutral",
    },
  ],
  "4": [
    {
      id: "401",
      name: "Chris Martin",
      comment: "Excellent build quality and performance. The display is stunning.",
      rating: 5,
      date: "2023-02-18T11:45:00Z",
      sentiment: "positive",
    },
    {
      id: "402",
      name: "Olivia Brown",
      comment: "Good laptop for work, but the battery life could be better.",
      rating: 4,
      date: "2023-03-25T16:20:00Z",
      sentiment: "neutral",
    },
  ],
}

// Add AI summary data for products
export const productSummaries: { [productId: string]: any } = {
  "1": {
    summary:
      "The iPhone 13 Pro is Apple's flagship smartphone featuring the powerful A15 Bionic chip, an advanced Pro camera system, and a stunning Super Retina XDR display with ProMotion technology for smoother scrolling and responsiveness.",
    features: [
      "A15 Bionic chip",
      "Pro camera system",
      "Super Retina XDR display",
      "ProMotion technology",
      "All-day battery life",
    ],
    pros: [
      "Exceptional camera quality",
      "Powerful performance",
      "Smooth 120Hz display",
      "Premium build quality",
      "Excellent battery life",
    ],
    cons: ["High price", "Limited customization", "No USB-C port", "Notch design"],
    useCases: [
      "Photography enthusiasts",
      "Mobile gaming",
      "Professional use",
      "Everyday productivity",
      "Content creation",
    ],
  },
  "2": {
    summary:
      "The Samsung Galaxy S21 is a high-performance Android smartphone powered by the Exynos 2100 processor, featuring 8GB RAM and a vibrant Dynamic AMOLED 2X display for an immersive viewing experience.",
    features: [
      "Exynos 2100 processor",
      "8GB RAM",
      "Dynamic AMOLED 2X display",
      "Triple camera system",
      "5G connectivity",
    ],
    pros: ["Beautiful display", "Powerful performance", "Versatile camera system", "Good battery life", "Sleek design"],
    cons: ["Plastic back panel", "No expandable storage", "No charger in box", "Exynos chip heating issues"],
    useCases: ["Android enthusiasts", "Mobile photography", "Multimedia consumption", "Everyday use", "Gaming"],
  },
  "3": {
    summary:
      "The MacBook Pro 16\" is Apple's premium laptop featuring the revolutionary M1 Pro chip, a stunning 16-inch Liquid Retina XDR display, and up to 32GB of unified memory for exceptional performance in professional workflows.",
    features: [
      "M1 Pro chip",
      "16-inch Liquid Retina XDR display",
      "Up to 32GB unified memory",
      "Pro audio system",
      "Long battery life",
    ],
    pros: ["Exceptional performance", "Beautiful display", "Excellent keyboard", "Great speakers", "Long battery life"],
    cons: ["Expensive", "Limited ports", "Not user upgradeable", "Heavy for travel"],
    useCases: [
      "Creative professionals",
      "Software developers",
      "Video editing",
      "Music production",
      "High-end productivity",
    ],
  },
}

// Function to get all products
export function getAllProducts(): Product[] {
  return products
}

// Function to get products by category
export function getProductsByCategory(category: string): Product[] {
  return products.filter((product) => product.category.toLowerCase() === category.toLowerCase())
}

// Function to get a product by ID
export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}

// Function to search products
export function searchProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase()
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowercaseQuery) || product.description.toLowerCase().includes(lowercaseQuery),
  )
}

// Function to filter products
export function filterProducts(filters: { category?: string; type?: string; color?: string }): Product[] {
  return products.filter((product) => {
    if (filters.category && product.category !== filters.category) return false
    if (filters.type && product.type !== filters.type) return false
    if (filters.color && product.color !== filters.color) return false
    return true
  })
}

// Function to get featured products
export function getFeaturedProducts(): Product[] {
  // In a real app, this might be based on popularity, sales, etc.
  return products.slice(0, 4)
}

// Function to get reviews for a product
export function getProductReviews(productId: string): Review[] {
  return reviews[productId] || []
}

// Function to add a review
export function addProductReview(productId: string, review: Omit<Review, "id" | "date">): Review {
  const newReview: Review = {
    ...review,
    id: generateId(),
    date: new Date().toISOString(),
  }

  if (!reviews[productId]) {
    reviews[productId] = []
  }

  reviews[productId].push(newReview)
  return newReview
}

// Function to get product summary
export function getProductSummary(productId: string): any {
  return productSummaries[productId] || null
}
