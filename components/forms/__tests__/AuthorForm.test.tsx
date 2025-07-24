import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { CREATE_AUTHOR, UPDATE_AUTHOR } from "@/lib/graphql/mutations";
import { useRouter } from "next/navigation";
import { AuthorForm } from "../author-form";
import { AuthProvider } from "@/components/auth/AuthProvider";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: { session: null },
      }),
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

describe("AuthorForm", () => {
  const push = jest.fn();
  const onCancel = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push });
    push.mockClear();
    onCancel.mockClear();
  });

  it("renders form with default values for create mode", () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <AuthProvider>
          <AuthorForm onCancel={onCancel} />
        </AuthProvider>
      </MockedProvider>
    );

    expect(screen.getByLabelText(/name/i)).toBeTruthy();
    expect(screen.getByLabelText(/born date/i)).toBeTruthy();
    expect(screen.getByLabelText(/biography/i)).toBeTruthy();
    expect(screen.getByText(/create author/i)).toBeTruthy();
  });

  it("renders form with values in edit mode", () => {
    const author = {
      id: "1",
      name: "Amish Tripathi",
      biography: "Author of Shiva Trilogy",
      born_date: "1974-10-18",
      avatar: "avatar.jpg",
    };

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <AuthProvider>
          <AuthorForm author={author} onCancel={onCancel} />
        </AuthProvider>
      </MockedProvider>
    );

    expect(screen.getByDisplayValue(author.name)).toBeTruthy();
    expect(screen.getByDisplayValue("1974-10-18")).toBeTruthy();
    expect(screen.getByDisplayValue(author.biography)).toBeTruthy();
    expect(screen.getByText(/edit author/i)).toBeTruthy();
    expect(screen.getByAltText(/author avatar/i)).toBeTruthy();
  });

  it("submits the form to create an author", async () => {
    const mocks = [
      {
        request: {
          query: CREATE_AUTHOR,
          variables: {
            name: "Test Author",
            biography: "Bio here",
            born_date: "2000-01-01",
            avatar: "",
          },
        },
        result: {
          data: {
            createAuthor: {
              id: "123",
              name: "Test Author",
              biography: "Bio here",
              born_date: "2000-01-01",
              avatar: "",
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AuthProvider>
          <AuthorForm onCancel={onCancel} />
        </AuthProvider>
      </MockedProvider>
    );

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Test Author" },
    });
    fireEvent.change(screen.getByLabelText(/born date/i), {
      target: { value: "2000-01-01" },
    });
    fireEvent.change(screen.getByLabelText(/biography/i), {
      target: { value: "Bio here" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create author/i }));

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith("/authors/123");
    });
  });

  it("calls onCancel when Cancel button is clicked", () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <AuthProvider>
          <AuthorForm onCancel={onCancel} />
        </AuthProvider>
      </MockedProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalled();
  });
});
