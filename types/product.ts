export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  type?: string
  color?: string
  image?: string
  stock?: number
}

export interface Review {
  id: string
  name: string
  comment: string
  rating: number
  date: string
  sentiment?: string
}
