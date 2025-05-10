"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import type { Review } from "@/types/product"

interface ReviewFormProps {
  productId: string
  onReviewAdded: (review: Review) => void
}

export function ReviewForm({ productId, onReviewAdded }: ReviewFormProps) {
  const [name, setName] = useState("")
  const [comment, setComment] = useState("")
  const [rating, setRating] = useState(5)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !comment.trim()) {
      toast({
        title: "Please fill all fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/reviews/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, comment, rating }),
      })

      if (!response.ok) throw new Error("Failed to submit review")

      const data = await response.json()

      // Get sentiment analysis
      const sentimentResponse = await fetch("/api/sentiment/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: comment }),
      })

      if (!sentimentResponse.ok) throw new Error("Failed to analyze sentiment")

      const sentimentData = await sentimentResponse.json()

      // Create the complete review with sentiment
      const newReview: Review = {
        id: data.id,
        name,
        comment,
        rating,
        date: new Date().toISOString(),
        sentiment: sentimentData.sentiment,
      }

      onReviewAdded(newReview)

      // Reset form
      setName("")
      setComment("")
      setRating(5)

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      })
    } catch (error) {
      toast({
        title: "Failed to submit review",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-medium">Write a Review</h3>
      <div>
        <Input placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} disabled={isSubmitting} />
      </div>
      <div>
        <div className="mb-2">
          <label className="text-sm">Rating: {rating}/5</label>
          <input
            type="range"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(Number.parseInt(e.target.value))}
            className="w-full"
            disabled={isSubmitting}
          />
        </div>
      </div>
      <div>
        <Textarea
          placeholder="Write your review here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          disabled={isSubmitting}
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  )
}
