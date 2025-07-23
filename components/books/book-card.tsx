"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Calendar, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Book {
  id: string;
  title: string;
  isbn?: string;
  publishedYear?: number;
  genre?: string;
  description?: string;
  cover_image?: string;
  rating?: number;
  reviewCount?: number;
  author: {
    id: string;
    name: string;
  };
}

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  console.log(book);
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

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <Link href={`/books/${book.id}`}>
        <div className="aspect-[3/4] relative overflow-hidden">
          {book.cover_image ? (
            <Image
              src={book.cover_image}
              alt={book.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <span className="text-blue-600 text-6xl font-bold opacity-20">
                📚
              </span>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {book.title}
          </h3>

          <div className="flex items-center text-sm text-gray-600 mb-2">
            <User className="h-3 w-3 mr-1" />
            <span className="truncate">{book.author?.name}</span>
          </div>

          {book.publishedYear && (
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{book.publishedYear}</span>
            </div>
          )}

          {book.genre && (
            <Badge variant="secondary" className="mb-3 text-xs">
              {book.genre}
            </Badge>
          )}

          {book.rating && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                {renderStars(book.rating)}
              </div>
              <span className="text-sm text-gray-600">
                {book.rating.toFixed(1)} ({book.reviewCount || 0})
              </span>
            </div>
          )}

          {book.description && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {book.description}
            </p>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}
