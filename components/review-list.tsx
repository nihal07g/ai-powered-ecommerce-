import type { Review } from "@/types/product"
import { Card, CardContent } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"

interface ReviewListProps {
  reviews: Review[]
}

export function ReviewList({ reviews }: ReviewListProps) {
  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "😊"
      case "negative":
        return "😞"
      default:
        return "😐"
    }
  }

  const getStarRating = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating)
  }

  if (reviews.length === 0) {
    return <p className="text-center py-4 text-muted-foreground">No reviews yet. Be the first to review!</p>
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">{review.name}</div>
                <div className="text-sm text-muted-foreground">{formatDate(review.date)}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-500">{getStarRating(review.rating)}</span>
                {review.sentiment && (
                  <span className="text-xl" title={`Sentiment: ${review.sentiment}`}>
                    {getSentimentEmoji(review.sentiment)}
                  </span>
                )}
              </div>
            </div>
            <p className="mt-2">{review.comment}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
