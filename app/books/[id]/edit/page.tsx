import { mockBooks } from "@/lib/mock-data";
import EditBookClient from "@/components/books/EditBookClient";

export async function generateStaticParams() {
  return mockBooks.map((book) => ({ id: String(book.id) }));
}

export default function EditBookPage({ params }: { params: { id: string } }) {
  const bookId = params.id;
  return <EditBookClient bookId={bookId} />;
}
