import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AuthForm from "../authForm";

jest.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
    },
  },
}));

const mockSignIn = require("@/lib/supabase").supabase.auth.signInWithPassword;
const mockSignUp = require("@/lib/supabase").supabase.auth.signUp;

describe("AuthForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form in sign-in mode by default", () => {
    render(<AuthForm />);
    expect(screen.getByPlaceholderText("Email")).toBeTruthy();
    expect(screen.getByPlaceholderText("Password")).toBeTruthy();
  });

  it("handles successful sign-in", async () => {
    mockSignIn.mockResolvedValueOnce({ error: null });

    render(<AuthForm />);
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "asdf@asdf.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "asdf" },
    });

    const signInButton = await screen.findByRole("button", {
      name: /Sign In/i,
    });

    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(screen.getByText("Signed in successfully!")).toBeTruthy();
    });
    expect(mockSignIn).toHaveBeenCalledWith({
      email: "asdf@asdf.com",
      password: "asdf",
    });
  });
});
