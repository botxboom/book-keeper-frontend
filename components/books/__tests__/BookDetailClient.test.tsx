// __tests__/BookDetailClient.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import BookDetailClient from "../BookDetailClient";
import { GET_BOOK } from "@/lib/graphql/queries";
import { DELETE_BOOK } from "@/lib/graphql/mutations";
import { AuthProvider } from "@/components/auth/AuthProvider";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn().mockResolvedValue({ data: { session: {} } }),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
  },
}));

jest.mock("@/components/auth/AuthProvider", () => {
  const actual = jest.requireActual("@/components/auth/AuthProvider");
  return {
    ...actual,
    useAuth: () => ({
      session: { user: { id: "123" } },
      signIn: jest.fn(),
      signOut: jest.fn(),
    }),
  };
});

const mockBook = {
  id: "1",
  title: "The Immortals of Meluha",
  description: "A mythological fiction novel.",
  published_date: "2010",
  cover_image: "https://example.com/cover.jpg",
  reviews: [],
  author: {
    id: "1",
    name: "Amish Tripathi",
    biography: "Bestselling author of the Shiva Trilogy.",
  },
};

const mocks = [
  {
    request: { query: GET_BOOK, variables: { id: "1" } },
    result: { data: { book: mockBook } },
  },
  {
    request: { query: DELETE_BOOK, variables: { id: "1" } },
    result: { data: { deleteBook: true } },
  },
];

describe("BookDetailClient", () => {
  it("renders book details", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthProvider>
          <BookDetailClient bookId="1" />
        </AuthProvider>
      </MockedProvider>
    );

    expect(await screen.findByText("The Immortals of Meluha")).toBeTruthy();
    expect(screen.getByText("A mythological fiction novel.")).toBeTruthy();
  });

  it("handles missing book", async () => {
    const emptyMocks = [
      {
        request: { query: GET_BOOK, variables: { id: "999" } },
        result: { data: { book: null } },
      },
    ];

    render(
      <MockedProvider mocks={emptyMocks} addTypename={false}>
        <AuthProvider>
          <BookDetailClient bookId="999" />
        </AuthProvider>
      </MockedProvider>
    );

    expect(await screen.findByText("Book not found")).toBeTruthy();
  });
});
