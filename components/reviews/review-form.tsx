"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ADD_REVIEW } from "@/lib/graphql/mutations";
import { Star, Send } from "lucide-react";
import { useAuth } from "../auth/AuthProvider";

interface ReviewFormProps {
  bookId: string;
  onReviewAdded: () => void;
}

export function ReviewForm({ bookId, onReviewAdded }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const { session } = useAuth();

  const [addReview, { loading }] = useMutation(ADD_REVIEW, {
    onCompleted: () => {
      setRating(0);
      setComment("");
      onReviewAdded();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating || !comment || !session) {
      alert("Please fill in all fields and select a rating");
      return;
    }

    try {
      await addReview({
        variables: {
          ...{
            bookId,
            rating,
            comment,
            user: session.user.email,
          },
        },
      });
    } catch (error) {
      console.error("Error adding review:", error);
      alert("Error adding review. Please try again.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`h-6 w-6 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Review</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this book..."
              rows={4}
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>Loading...</>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Review
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
