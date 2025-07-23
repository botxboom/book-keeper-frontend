import { gql } from "@apollo/client";

// Book Mutations
export const CREATE_BOOK = gql`
  mutation CreateBook(
    $title: String!
    $description: String
    $published_date: String
    $authorId: ID!
    $cover_image: String
  ) {
    createBook(
      title: $title
      description: $description
      published_date: $published_date
      author_id: $authorId
      cover_image: $cover_image
    ) {
      id
      title
      description
      published_date
      cover_image
      author {
        id
        name
      }
    }
  }
`;

export const UPDATE_BOOK = gql`
  mutation UpdateBook(
    $id: ID!
    $title: String
    $description: String
    $published_date: String
    $cover_image: String
  ) {
    updateBook(
      id: $id
      title: $title
      description: $description
      published_date: $published_date
      cover_image: $cover_image
    ) {
      id
      title
      description
      published_date
      cover_image
      author {
        id
        name
        avatar
        biography
      }
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id)
  }
`;

// Author Mutations
export const CREATE_AUTHOR = gql`
  mutation CreateAuthor(
    $name: String!
    $biography: String
    $born_date: String
    $avatar: String
  ) {
    createAuthor(
      name: $name
      biography: $biography
      born_date: $born_date
      avatar: $avatar
    ) {
      id
      name
      biography
      born_date
      avatar
    }
  }
`;

export const UPDATE_AUTHOR = gql`
  mutation UpdateAuthor(
    $id: ID!
    $name: String
    $biography: String
    $born_date: String
    $avatar: String
  ) {
    updateAuthor(
      id: $id
      name: $name
      biography: $biography
      born_date: $born_date
      avatar: $avatar
    ) {
      id
      name
      biography
      born_date
      avatar
    }
  }
`;

export const DELETE_AUTHOR = gql`
  mutation DeleteAuthor($id: ID!) {
    deleteAuthor(id: $id)
  }
`;

// Review Mutations
export const ADD_REVIEW = gql`
  mutation AddReview(
    $bookId: String!
    $user: String!
    $rating: Int!
    $comment: String
  ) {
    addReview(
      bookId: $bookId
      user: $user
      rating: $rating
      comment: $comment
    ) {
      id
      bookId
      user
      rating
      comment
      createdAt
    }
  }
`;

export const DELETE_REVIEW = gql`
  mutation DeleteReview($id: ID!) {
    deleteReview(id: $id)
  }
`;
