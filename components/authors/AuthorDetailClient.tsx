"use client";

import { useQuery, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { GET_AUTHORS } from "@/lib/graphql/queries";
import { DELETE_AUTHOR } from "@/lib/graphql/mutations";
import { mockAuthors } from "@/lib/mock-data";
import { Edit, Trash2, ArrowLeft, BookOpen } from "lucide-react";
import { formatDateForInput } from "@/lib/utils";
import { useAuth } from "../auth/AuthProvider";

export default function AuthorDetailClient({ authorId }: { authorId: string }) {
  const router = useRouter();
  const { session } = useAuth();

  const { data, loading, error, refetch } = useQuery(GET_AUTHORS, {
    variables: { filter: "", page: 1, limit: 100 },
    errorPolicy: "all",
  });

  const [deleteAuthor, { loading: deleting }] = useMutation(DELETE_AUTHOR, {
    onCompleted: () => {
      router.push("/authors");
    },
    onError: (error) => {
      console.error("Error deleting author:", error);
      alert("Error deleting author. Please try again.");
    },
  });

  // Find the author by id
  const author =
    data?.authors?.find((a: any) => a.id === authorId) ||
    mockAuthors.find((a) => a.id === authorId);

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this author? This action cannot be undone."
      )
    ) {
      try {
        await deleteAuthor({ variables: { id: authorId } });
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSpinner size="lg" className="h-64" />
      </div>
    );
  }

  if (!author) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <BookOpen className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Author not found
          </h3>
          <p className="text-gray-600 mb-6">
            The author you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/authors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Authors
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
        <Link href="/authors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Authors
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Author Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {author.name}
                </h1>
                {author.born_date && (
                  <div className="text-sm text-gray-600">
                    Born: {formatDateForInput(author.born_date)}
                  </div>
                )}
                {session && (
                  <div className="flex space-x-2 pt-4">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Link href={`/authors/${authorId}/edit`}>
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
          {/* Biography */}
          {author.biography && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">Biography</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {author.biography}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Books by Author */}
          {author.books && author.books.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">
                  Books by {author.name}
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  {author.books.map((book: any) => (
                    <li key={book.id}>
                      <Link
                        href={`/books/${book.id}`}
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        {book.title}
                      </Link>
                      {book.published_date && (
                        <span className="ml-2 text-sm text-gray-500">
                          ({book.published_date})
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
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
