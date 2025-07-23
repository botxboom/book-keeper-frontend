import { mockAuthors } from "@/lib/mock-data";
import AuthorDetailClient from "@/components/authors/AuthorDetailClient";

export async function generateStaticParams() {
  // Map each author to an object with their id as a string
  return mockAuthors.map((author) => ({ id: String(author.id) }));
}

export default function AuthorDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const authorId = params.id;
  return <AuthorDetailClient authorId={authorId} />;
}
