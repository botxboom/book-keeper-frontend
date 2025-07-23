// components/AuthForm.tsx
"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  const handleAuth = async () => {
    setLoading(true);
    setMessage("");

    const { error } =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(
        mode === "signup"
          ? "Check your email for confirmation link"
          : "Signed in successfully!"
      );
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 shadow-lg rounded-xl border mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {mode === "signin" ? "Sign In" : "Sign Up"}
      </h2>
      <input
        type="email"
        className="w-full border p-2 rounded mb-4"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="w-full border p-2 rounded mb-4"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 mb-2"
        onClick={handleAuth}
        disabled={loading}
      >
        {loading ? "Loading..." : mode === "signin" ? "Sign In" : "Sign Up"}
      </button>
      <p className="text-sm text-center">
        {mode === "signin"
          ? "Don't have an account?"
          : "Already have an account?"}{" "}
        <button
          className="text-blue-600\"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        >
          {mode === "signin" ? "Sign Up" : "Sign In"}
        </button>
      </p>
      {message && <p className="mt-4 text-center text-red-500\">{message}</p>}
    </div>
  );
}
