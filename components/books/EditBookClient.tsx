"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { BookForm } from "@/components/forms/book-form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { GET_BOOK, GET_BOOKS } from "@/lib/graphql/queries";
import { Button } from "../ui/button";

export default function EditBookClient({ bookId }: { bookId: string }) {
  const router = useRouter();

  // First try to get the specific book
  const { data: bookData, loading: bookLoading } = useQuery(GET_BOOK, {
    variables: { id: bookId },
    fetchPolicy: "cache-first",
    errorPolicy: "all",
  });

  // Fallback to books list if individual book query fails
  const { data: booksData, loading: booksLoading } = useQuery(GET_BOOKS, {
    variables: { filter: "", page: 1, limit: 100 },
    fetchPolicy: "cache-first",
    skip: !!bookData?.book, // Skip if we already have the book
  });

  const book =
    bookData?.book || booksData?.books?.find((b: any) => b.id === bookId);
  const loading = bookLoading || booksLoading;

  const handleCancel = () => {
    router.push(`/books/${bookId}`);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSpinner size="lg" className="h-64" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Book not found
          </h3>
          <p className="text-gray-600">
            The book you're trying to edit doesn't exist or is still loading.
          </p>
          <Button onClick={() => router.push("/books")} className="mt-4">
            Go to Books
          </Button>
        </div>
      </div>
    );
  }

  const data = {
    id: book.id,
    title: book.title,
    description: book.description,
    published_date: book.published_date,
    authorId: book.author?.id || book.authorId,
    coverImage: book.cover_image,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BookForm book={data} onCancel={handleCancel} />
    </div>
  );
}
