"use client";

import { Star, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDateForInput } from "@/lib/utils";

interface Review {
  id: string;
  rating: number;
  comment: string;
  user: string;
  createdAt: string;
}

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          No reviews yet. Be the first to review this book!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <Avatar>
                <AvatarFallback>
                  {review.user.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{review.user}</h4>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDateForInput(review.createdAt)}
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  {renderStars(review.rating)}
                  <span className="text-sm text-gray-600 ml-2">
                    {review.rating}.0
                  </span>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  {review.comment}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
