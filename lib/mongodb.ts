import { MongoClient } from "mongodb"
import { products, reviews } from "@/lib/product-data"

const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB = process.env.MONGODB_DB || "ecommerce"

// Local data fallback
const localDb = {
  products: {
    find: (query = {}) => ({
      toArray: async () => {
        // Simple filtering based on query
        if (query.category) {
          return products.filter((p) => p.category === query.category)
        }
        if (query.id) {
          const product = products.find((p) => p.id === query.id)
          return product ? [product] : []
        }
        return products
      },
      skip: () => ({
        limit: () => ({
          toArray: async () => products,
        }),
      }),
    }),
    findOne: async (query = {}) => {
      if (query.id) {
        return products.find((p) => p.id === query.id) || null
      }
      return null
    },
    updateOne: async () => ({ modifiedCount: 1 }),
    createIndex: async () => {},
  },
  reviews: {
    find: (query = {}) => ({
      toArray: async () => {
        if (query.productId) {
          return reviews[query.productId] || []
        }
        return Object.values(reviews).flat()
      },
    }),
    findOne: async (query = {}) => null,
    updateOne: async () => ({ modifiedCount: 1 }),
    insertOne: async (doc) => ({ insertedId: doc.id }),
  },
}

export async function connectToDatabase() {
  // If MongoDB URI is not defined, use local data
  if (!MONGODB_URI) {
    console.log("MongoDB URI not defined, using local data")
    return { client: null, db: localDb }
  }

  try {
    // Create a new MongoDB client
    const client = new MongoClient(MONGODB_URI as string)
    await client.connect()
    const db = client.db(MONGODB_DB)
    return { client, db }
  } catch (error) {
    console.error("Failed to connect to MongoDB, using local data", error)
    return { client: null, db: localDb }
  }
}
