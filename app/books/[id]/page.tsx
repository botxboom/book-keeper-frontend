import BookDetailClient from "@/components/books/BookDetailClient";

export async function generateStaticParams() {
  // Fetch books from your GraphQL API
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
    next: { revalidate: 60 },
  });

  const { data } = await res.json();
  const books = data?.books || [];
  return books.map((book: { id: string }) => ({ id: book.id }));
}

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const bookId = params.id;
  return <BookDetailClient bookId={bookId} />;
}
