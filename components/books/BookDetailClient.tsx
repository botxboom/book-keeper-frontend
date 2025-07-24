"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ReviewForm } from "@/components/reviews/review-form";
import { ReviewList } from "@/components/reviews/review-list";
import { GET_BOOK } from "@/lib/graphql/queries";
import { DELETE_BOOK } from "@/lib/graphql/mutations";
import {
  Star,
  Calendar,
  User,
  BookOpen,
  Edit,
  Trash2,
  ArrowLeft,
  Globe,
  Hash,
} from "lucide-react";
import { useAuth } from "../auth/AuthProvider";
import { GET_BOOKS } from "@/lib/graphql/queries";

export default function BookDetailClient({ bookId }: { bookId: string }) {
  const router = useRouter();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { session } = useAuth();

  const { data, loading, error, refetch } = useQuery(GET_BOOK, {
    variables: { id: bookId },
    fetchPolicy: "cache-first",
  });

  const [deleteBook, { loading: deleting }] = useMutation(DELETE_BOOK, {
    update(cache, { data }) {
      if (!data?.deleteBook) return;
      const ITEMS_PER_PAGE = 12;
      const listVariables = { filter: "", offset: 0, limit: ITEMS_PER_PAGE };

      // Update the books list cache
      const existing = cache.readQuery({
        query: GET_BOOKS,
        variables: listVariables,
      }) as { books?: any[] } | null;
      if (existing && Array.isArray(existing.books)) {
        cache.writeQuery({
          query: GET_BOOKS,
          variables: listVariables,
          data: {
            books: existing.books.filter((b) => b.id !== bookId),
          },
        });
      }

      // Optionally, evict the single book from the cache
      cache.evict({ id: cache.identify({ __typename: "Book", id: bookId }) });
      cache.gc();
    },
    onCompleted: () => {
      router.push("/books");
    },
    onError: (error) => {
      console.error("Error deleting book:", error);
      alert("Error deleting book. Please try again.");
    },
  });

  const book = data?.book;

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this book? This action cannot be undone."
      )
    ) {
      try {
        await deleteBook({ variables: { id: bookId } });
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSpinner size="lg" className="h-64" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <BookOpen className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Book not found
          </h3>
          <p className="text-gray-600 mb-6">
            The book you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/books">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Books
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/books">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Books
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Book Cover & Basic Info */}
        <div className="lg:col-span-1">
          <Card className="overflow-hidden">
            <div className="aspect-[3/4] relative">
              {book.cover_image ? (
                <Image
                  src={book.cover_image}
                  alt={book.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <BookOpen className="h-24 w-24 text-blue-600 opacity-20" />
                </div>
              )}
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                {book.rating && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      {renderStars(book.rating)}
                    </div>
                    <span className="text-sm text-gray-600">
                      {book.rating.toFixed(1)} ({book.reviewCount || 0} reviews)
                    </span>
                  </div>
                )}

                <div className="space-y-3">
                  {book.isbn && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Hash className="h-4 w-4 mr-2" />
                      <span>ISBN: {book.isbn}</span>
                    </div>
                  )}

                  {book.publishedYear && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Published: {book.publishedYear}</span>
                    </div>
                  )}

                  <div className="flex items-center text-sm text-gray-600">
                    <User className="h-4 w-4 mr-2" />
                    <Link
                      href={`/authors/${book.author?.id}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {book.author?.name}
                    </Link>
                  </div>
                </div>

                {book.genre && (
                  <Badge variant="secondary" className="w-fit">
                    {book.genre}
                  </Badge>
                )}

                {session && (
                  <div className="flex space-x-2 pt-4">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Link href={`/books/${bookId}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDelete}
                      disabled={deleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Book Details */}
          <Card>
            <CardContent className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {book.title}
              </h1>

              {book.description && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {book.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Author Information */}
          {book.author?.biography && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">About the Author</h3>
                <div className="flex items-start space-x-4">
                  <div className="flex-1">
                    <Link
                      href={`/authors/${book.author?.id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      {book.author?.name}
                    </Link>
                    <p className="text-gray-700 mt-2 leading-relaxed">
                      {book.author?.biography}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reviews Section */}
          <Card>
            <CardContent className="p-6">
              {session && (
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Reviews</h3>
                  <Button
                    variant="outline"
                    onClick={() => setShowReviewForm(!showReviewForm)}
                  >
                    {showReviewForm ? "Cancel" : "Write Review"}
                  </Button>
                </div>
              )}

              {showReviewForm && (
                <div className="mb-6">
                  <ReviewForm
                    bookId={bookId}
                    onReviewAdded={() => {
                      setShowReviewForm(false);
                      refetch();
                    }}
                  />
                  <Separator className="mt-6" />
                </div>
              )}

              <ReviewList reviews={book.reviews || []} />
            </CardContent>
          </Card>
        </div>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-4">
          <p className="text-yellow-800">
            Note: Using mock data. Connect to a GraphQL server for full
            functionality.
          </p>
        </div>
      )}
    </div>
  );
}
