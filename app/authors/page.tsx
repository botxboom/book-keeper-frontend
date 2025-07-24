"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { AuthorCard } from "@/components/authors/author-card";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { GET_AUTHORS } from "@/lib/graphql/queries";
import { Plus, Users } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";

const ITEMS_PER_PAGE = 12;

export const revalidate = 60;

export default function AuthorsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const { session } = useAuth();

  const { data, loading, error } = useQuery(GET_AUTHORS, {
    variables: {
      limit: ITEMS_PER_PAGE,
      offset: (currentPage - 1) * ITEMS_PER_PAGE,
      filter: "",
    },
    errorPolicy: "all",
    fetchPolicy: "cache-first",
  });

  const authors = data?.authors;
  const totalCount = data?.authors.length;

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const filteredAuthors = useMemo(() => {
    return authors?.filter((author: any) =>
      author.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [authors, search]);

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
            <Users className="h-8 w-8 mr-3 text-blue-600" />
            Authors
          </h1>
          <p className="text-gray-600 mt-2">
            Explore and manage author profiles and their literary works
          </p>
        </div>
        {session && (
          <Button asChild className="mt-4 sm:mt-0">
            <Link href="/authors/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Author
            </Link>
          </Button>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search authors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        />
      </div>

      {/* Authors Grid */}
      {filteredAuthors?.length === 0 ? (
        <div className="text-center py-16">
          <Users className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No authors found
          </h3>

          <Button asChild>
            <Link href="/authors/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Your Author
            </Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredAuthors?.map((author: any) => (
              <AuthorCard key={author.id} author={author} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
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
