// __tests__/book-form.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { CREATE_BOOK, UPDATE_BOOK } from "@/lib/graphql/mutations";
import { GET_AUTHORS } from "@/lib/graphql/queries";
import { useRouter } from "next/navigation";
import { BookForm } from "../book-form";
import { AuthProvider } from "@/components/auth/AuthProvider";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: jest.fn(() => ({
        data: {
          subscription: {
            unsubscribe: jest.fn(),
          },
        },
      })),
      signInWithPassword: jest.fn().mockResolvedValue({
        data: { session: { user: { id: "123" } } },
        error: null,
      }),
      signUp: jest.fn().mockResolvedValue({
        data: { session: null },
        error: null,
      }),
      signOut: jest.fn().mockResolvedValue({ error: null }),
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

describe("BookForm", () => {
  const push = jest.fn();
  const onCancel = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push });
    push.mockClear();
    onCancel.mockClear();
  });

  const authorMock = {
    request: {
      query: GET_AUTHORS,
      variables: { limit: 100 },
    },
    result: {
      data: {
        authors: [{ id: "1", name: "Author One" }],
      },
    },
  };

  it("renders form with default values for create mode", async () => {
    render(
      <MockedProvider mocks={[authorMock]} addTypename={false}>
        <AuthProvider>
          <BookForm onCancel={onCancel} />
        </AuthProvider>
      </MockedProvider>
    );

    expect(await screen.findByLabelText(/title/i)).toBeTruthy();
    expect(screen.getByLabelText(/published date/i)).toBeTruthy();
    expect(screen.getByLabelText(/description/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: /create book/i })).toBeTruthy();
  });

  it("renders form with values in edit mode", async () => {
    const book = {
      id: "1",
      title: "Test Book",
      description: "Some description",
      published_date: "2023-01-01",
      authorId: "1",
      coverImage: "cover.jpg",
    };

    render(
      <MockedProvider mocks={[authorMock]} addTypename={false}>
        <AuthProvider>
          <BookForm book={book} onCancel={onCancel} />
        </AuthProvider>
      </MockedProvider>
    );

    expect(await screen.findByDisplayValue("Test Book")).toBeTruthy();
    expect(screen.getByDisplayValue("2023-01-01")).toBeTruthy();
    expect(screen.getByDisplayValue("Some description")).toBeTruthy();
    expect(screen.getByRole("button", { name: /update book/i })).toBeTruthy();
  });

  it("submits the form to create a book", async () => {
    const mocks = [
      authorMock,
      {
        request: {
          query: CREATE_BOOK,
          variables: {
            title: "New Book",
            description: "New Description",
            published_date: "2022-12-01",
            authorId: "1",
            cover_image: undefined,
          },
        },
        result: {
          data: {
            createBook: {
              id: "456",
              title: "New Book",
              description: "New Description",
              published_date: "2022-12-01",
              authorId: "1",
              cover_image: null,
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthProvider>
          <BookForm onCancel={onCancel} />
        </AuthProvider>
      </MockedProvider>
    );

    fireEvent.change(await screen.findByLabelText(/title/i), {
      target: { value: "New Book" },
    });

    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "New Description" },
    });

    fireEvent.change(screen.getByLabelText(/published date/i), {
      target: { value: "2022-12-01" },
    });

    fireEvent.mouseDown(screen.getByText("Select an author"));
    fireEvent.click(await screen.findByText("Author One"));

    // Wait for the dropdown options to appear and click one
    const authorOption = await screen.findByText("Author One"); // the text shown in the dropdown
    fireEvent.click(authorOption);

    fireEvent.click(screen.getByRole("button", { name: /create book/i }));
  });

  it("calls onCancel when Cancel button is clicked", async () => {
    render(
      <MockedProvider mocks={[authorMock]} addTypename={false}>
        <AuthProvider>
          <BookForm onCancel={onCancel} />
        </AuthProvider>
      </MockedProvider>
    );

    fireEvent.click(await screen.findByRole("button", { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalled();
  });
});
