"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Plus, Menu, X, Book } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { session, signOut, signIn } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Book className="h-8 w-8" />
            <span className="text-xl font-bold">Book Keeper</span>
          </Link>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <nav className="hidden md:flex items-start space-x-8">
              <Link
                href="/books"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Books
              </Link>
              <Link
                href="/authors"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Authors
              </Link>
            </nav>
            {/* User Icon & Auth */}
            <Button
              variant="ghost"
              size="icon"
              className="ml-2"
              onClick={() => setShowAuth(true)}
            >
              <User className="h-6 w-6" />
            </Button>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white py-4">
            <div className="space-y-4">
              {/* Mobile Navigation */}
              <nav className="flex flex-col space-y-2">
                <Link
                  href="/books"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Books
                </Link>
                <Link
                  href="/authors"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Authors
                </Link>
              </nav>

              {/* Mobile Actions */}
              <div className="flex flex-col space-y-2 pt-2 border-t">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/books/new" onClick={() => setIsMenuOpen(false)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Book
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href="/authors/new"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Author
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAuth(true)}
                >
                  <User className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Auth Modal */}
        {showAuth && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Sign In</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAuth(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              {!session ? (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const email = (e.target as any).email.value;
                    const password = (e.target as any).password.value;
                    signIn(email, password);
                    setShowAuth(false);
                  }}
                  className="space-y-4"
                >
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                  />
                  <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                  />
                  <Button type="submit" className="w-full">
                    Sign In
                  </Button>
                </form>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  <span className="text-gray-700">
                    Signed in as {session.user.email}
                  </span>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      signOut();
                      setShowAuth(false);
                    }}
                  >
                    Sign Out
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
