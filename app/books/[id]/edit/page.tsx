import { mockBooks } from "@/lib/mock-data";
import EditBookClient from "@/components/books/EditBookClient";
import { gql } from "@apollo/client";

export const GET_BOOK = gql`
  query GetBook($id: ID!) {
    book(id: $id) {
      id
      title
      description
      published_date
      cover_image
      author {
        id
        name
        biography
        born_date
        avatar
      }
      reviews {
        id
        bookId
        user
        rating
        comment
        createdAt
      }
    }
  }
`;

export async function generateStaticParams() {
  return mockBooks.map((book) => ({ id: String(book.id) }));
}

export default function EditBookPage({ params }: { params: { id: string } }) {
  const bookId = params.id;
  return <EditBookClient bookId={bookId} />;
}
