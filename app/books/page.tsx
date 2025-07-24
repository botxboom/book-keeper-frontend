"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { BookCard } from "@/components/books/book-card";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { GET_BOOKS } from "@/lib/graphql/queries";
import { Plus, Book } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";

const ITEMS_PER_PAGE = 12;

export const revalidate = 60;

export default function BooksPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const { session } = useAuth();

  const { data, loading, error } = useQuery(GET_BOOKS, {
    variables: {
      limit: ITEMS_PER_PAGE,
      offset: (currentPage - 1) * ITEMS_PER_PAGE,
      filter: "",
    },
    errorPolicy: "all", 
    fetchPolicy: "cache-first",
  });

  // Use mock data if GraphQL query fails
  const books = data?.books;
  const totalCount = data?.books.length;

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const filteredBooks = useMemo(() => {
    return books?.filter((book: any) =>
      book.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [books, search]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSpinner size="lg" className="h-64" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Book className="h-8 w-8 mr-3 text-blue-600" />
            Books
          </h1>
          <p className="text-gray-600 mt-2">
            Discover and manage your book collection
          </p>
        </div>
        {session && (
          <Button asChild className="mt-4 sm:mt-0">
            <Link href="/books/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Book
            </Link>
          </Button>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        />
      </div>

      {/* Books Grid */}
      {filteredBooks?.length === 0 ? (
        <div className="text-center py-16">
          <Book className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No books found
          </h3>

          <Button asChild>
            <Link href="/books/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Your Book
            </Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {filteredBooks?.map((book: any) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mb-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}

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
