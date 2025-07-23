// "use client";

import { mockBooks } from "@/lib/mock-data";
import EditAuthorClient from "@/components/authors/EditAuthorClient";

export async function generateStaticParams() {
  return mockBooks.map((book) => ({ id: String(book.id) }));
}

export default function EditAuthor({ params }: { params: { id: string } }) {
  const bookId = params.id;
  return <EditAuthorClient authorId={bookId} />;
}
