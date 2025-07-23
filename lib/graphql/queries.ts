import { gql } from "@apollo/client";

export const GET_BOOKS = gql`
  query Books($filter: String, $page: Int, $limit: Int) {
    books(filter: $filter, page: $page, limit: $limit) {
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

export const GET_AUTHORS = gql`
  query GetAuthors($filter: String, $page: Int, $limit: Int) {
    authors(filter: $filter, page: $page, limit: $limit) {
      id
      name
      biography
      born_date
      avatar
      books {
        id
        title
        description
        published_date
        cover_image
      }
    }
  }
`;

export const GET_REVIEWS_BY_BOOK = gql`
  query ReviewsByBook($bookId: String!) {
    reviewsByBook(bookId: $bookId) {
      id
      bookId
      user
      rating
      comment
      createdAt
    }
  }
`;
