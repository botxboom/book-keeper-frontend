import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import AuthorDetailClient from "../AuthorDetailClient";
import { GET_AUTHORS } from "@/lib/graphql/queries";
import { DELETE_AUTHOR } from "@/lib/graphql/mutations";
import { AuthProvider } from "@/components/auth/AuthProvider";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
}));

jest.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
  },
}));

const mockAuthor = {
  id: "1",
  name: "Amish Tripathi",
  born_date: "1974-10-18",
  biography: "Bestselling author of the Shiva Trilogy.",
  books: [
    { id: "101", title: "The Immortals of Meluha", published_date: "2010" },
  ],
};

const mocks = [
  {
    request: {
      query: GET_AUTHORS,
      variables: { filter: "", page: 1, limit: 100 },
    },
    result: {
      data: {
        authors: [mockAuthor],
      },
    },
  },
];

describe("AuthorDetailClient", () => {
  it("renders author details correctly", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthProvider>
          <AuthorDetailClient authorId="1" />
        </AuthProvider>
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("Amish Tripathi")).toBeTruthy();
      expect(screen.getByText("Born: 1974-10-18")).toBeTruthy();
      expect(screen.getByText("Biography")).toBeTruthy();
      expect(screen.getByText("The Immortals of Meluha")).toBeTruthy();
    });
  });

  it("handles missing author case", async () => {
    const emptyMocks = [
      {
        request: {
          query: GET_AUTHORS,
          variables: { filter: "", page: 1, limit: 100 },
        },
        result: {
          data: { authors: [] },
        },
      },
    ];

    render(
      <MockedProvider mocks={emptyMocks} addTypename={false}>
        <AuthProvider>
          <AuthorDetailClient authorId="999" />
        </AuthProvider>
      </MockedProvider>
    );

    await waitFor(() =>
      expect(screen.getByText("Author not found")).toBeTruthy()
    );
  });
});
