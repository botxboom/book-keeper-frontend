"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, BookOpen, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Author {
  id: string;
  name: string;
  biography?: string;
  birthYear?: number;
  nationality?: string;
  avatar?: string;
  bookCount?: number;
  books?: Array<{
    id: string;
    title: string;
    cover_image?: string;
    rating?: number;
  }>;
}

interface AuthorCardProps {
  author: Author;
}

export function AuthorCard({ author }: AuthorCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <Link href={`/authors/${author.id}`}>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
              {author.avatar ? (
                <Image
                  src={author.avatar}
                  alt={author.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                  <span className="text-orange-600 text-xl font-bold">
                    {author.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                {author.name}
              </h3>

              <div className="flex flex-wrap gap-2 mb-3">
                {author.birthYear && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{author.birthYear}</span>
                  </div>
                )}

                {author.nationality && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Globe className="h-3 w-3 mr-1" />
                    <span>{author.nationality}</span>
                  </div>
                )}
              </div>

              {author.bookCount && (
                <div className="flex items-center mb-3">
                  <BookOpen className="h-4 w-4 mr-1 text-blue-600" />
                  <Badge variant="outline" className="text-xs">
                    {author.bookCount}{" "}
                    {author.bookCount === 1 ? "book" : "books"}
                  </Badge>
                </div>
              )}

              {author.biography && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {author.biography}
                </p>
              )}
            </div>
          </div>

          {author.books && author.books.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-gray-500 mb-2">Recent Books:</p>
              <div className="flex space-x-2 overflow-x-auto pb-1">
                {author.books.slice(0, 3).map((book) => (
                  <div
                    key={book.id}
                    className="flex-shrink-0 w-12 h-16 relative rounded overflow-hidden"
                  >
                    {book.cover_image ? (
                      <Image
                        src={book.cover_image}
                        alt={book.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}
