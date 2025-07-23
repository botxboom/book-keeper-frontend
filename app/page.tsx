"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Search, TrendingUp } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

export default function Home() {
  const { session } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="mb-8">
          <BookOpen className="h-20 w-20 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-blue-600">Book Keeper</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your comprehensive digital library management system. Organize,
            discover, and manage your book collection with powerful tools and
            intuitive design.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild className="text-lg px-8 py-6">
            <Link href="/books">
              <BookOpen className="h-5 w-5 mr-2" />
              Browse Books
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="text-lg px-8 py-6"
          >
            <Link href="/authors">
              <Users className="h-5 w-5 mr-2" />
              Explore Authors
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      {session && (
        <div className="bg-white rounded-lg border p-8 text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Ready to get started?
          </h3>
          <p className="text-gray-600 mb-6">
            Add your book or author to begin building your digital library.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/books/new">Add Your Book</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/authors/new">Add an Author</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
