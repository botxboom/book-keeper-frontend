// app/books/[id]/page.tsx
import BookDetailClient from "@/components/books/BookDetailClient";

export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  const res = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        query {
          books(page: 1, limit: 100) {
            id
          }
        }
      `,
    }),
  });

  const { data } = await res.json();
  const books = data?.books || [];
  return books.map((book: { id: string }) => ({ id: book.id }));
}

export default function BookDetailPage({ params }: { params: { id: string } }) {
  return <BookDetailClient bookId={params.id} />;
}
