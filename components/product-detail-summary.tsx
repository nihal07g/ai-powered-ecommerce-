"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from "lucide-react"
import { getProductSummary } from "@/lib/product-data"

interface ProductSummaryProps {
  productId: string
}

interface SummaryData {
  summary: string
  features: string[]
  pros: string[]
  cons: string[]
  useCases: string[]
}

export function ProductDetailSummary({ productId }: ProductSummaryProps) {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsLoading(true)

        // First check if we have local data
        const localSummary = getProductSummary(productId)

        if (localSummary) {
          setSummaryData(localSummary)
          setIsLoading(false)
          return
        }

        // If no local data, try the API
        const response = await fetch(`/api/product/${productId}/summary`)

        if (!response.ok) {
          throw new Error("Failed to fetch product summary")
        }

        const data = await response.json()
        setSummaryData(data)
      } catch (err) {
        setError("Could not load AI-generated summary")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSummary()
  }, [productId])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Product Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-muted rounded animate-pulse w-full"></div>
            <div className="h-4 bg-muted rounded animate-pulse w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !summaryData) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Product Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p>{summaryData.summary}</p>
          </div>

          {summaryData.features && summaryData.features.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Key Features</h4>
              <div className="flex flex-wrap gap-2">
                {summaryData.features.map((feature, index) => (
                  <Badge key={index} variant="outline">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {summaryData.pros && summaryData.pros.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                  Pros
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  {summaryData.pros.map((pro, index) => (
                    <li key={index}>{pro}</li>
                  ))}
                </ul>
              </div>
            )}

            {summaryData.cons && summaryData.cons.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 flex items-center">
                  <XCircle className="h-4 w-4 mr-1 text-red-500" />
                  Cons
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  {summaryData.cons.map((con, index) => (
                    <li key={index}>{con}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {summaryData.useCases && summaryData.useCases.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Best For</h4>
              <div className="flex flex-wrap gap-2">
                {summaryData.useCases.map((useCase, index) => (
                  <Badge key={index} variant="secondary">
                    {useCase}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
