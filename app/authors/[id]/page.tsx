import { mockAuthors } from "@/lib/mock-data";
import AuthorDetailClient from "@/components/authors/AuthorDetailClient";

export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  const res = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        query {
          authors(page: 1, limit: 100) {
            id
          }
        }
      `,
    }),
  });

  const { data } = await res.json();
  console.log(data);
  const authors = data?.authors || [];
  return authors.map((author: { id: string }) => ({ id: author.id }));
}

export default function AuthorDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const authorId = params.id;
  console.log(authorId);
  return <AuthorDetailClient authorId={authorId} />;
}
