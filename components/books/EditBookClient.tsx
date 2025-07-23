"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { BookForm } from "@/components/forms/book-form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { GET_BOOKS } from "@/lib/graphql/queries";
import { mockBooks } from "@/lib/mock-data";

export default function EditBookClient({ bookId }: { bookId: string }) {
  const router = useRouter();

  const { data, loading } = useQuery(GET_BOOKS, {
    variables: { filter: "", page: 1, limit: 100 },
    errorPolicy: "all",
  });

  // Find the book by id
  const book =
    data?.books?.find((b: any) => b.id === bookId) ||
    mockBooks.find((b) => b.id === bookId);

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 cpy-8">
        <div className="text-center py-16">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Book not found
          </h3>
          <p className="text-gray-600">
            The book you're trying to edit doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const bookData = {
    id: book.id,
    title: book.title,
    description: book.description,
    published_date: book.published_date,
    authorId: book.author.id,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BookForm book={bookData} onCancel={handleCancel} />
    </div>
  );
}
