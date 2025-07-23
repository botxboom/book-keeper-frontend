"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { AuthorForm } from "@/components/forms/author-form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { GET_AUTHORS } from "@/lib/graphql/queries";
import { mockAuthors } from "@/lib/mock-data";

export default function EditAuthorClient({ authorId }: { authorId: string }) {
  const router = useRouter();

  const { data, loading } = useQuery(GET_AUTHORS, {
    variables: { filter: "", page: 1, limit: 100 },
    errorPolicy: "all",
    fetchPolicy: "network-only",
  });

  // Find the author by id
  const author =
    data?.authors?.find((a: any) => a.id === authorId) ||
    mockAuthors.find((a) => a.id === authorId);

  const handleCancel = () => {
    router.push(`/authors/${authorId}`);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSpinner size="lg" className="h-64" />
      </div>
    );
  }

  if (!author) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Author not found
          </h3>
          <p className="text-gray-600">
            The author you're trying to edit doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const authorData = {
    id: author.id,
    name: author.name,
    biography: author.biography,
    born_date: author.born_date,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AuthorForm author={authorData} onCancel={handleCancel} />
    </div>
  );
}
