"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CREATE_BOOK, UPDATE_BOOK } from "@/lib/graphql/mutations";
import { GET_AUTHORS, GET_BOOKS } from "@/lib/graphql/queries";
import { Loader2, Save, X } from "lucide-react";
import { formatDateForInput } from "@/lib/utils";
import { ImageUpload } from "@/components/ui/image-upload";

interface Book {
  id?: string;
  title: string;
  description?: string;
  published_date?: string;
  authorId: string;
  coverImage?: string;
}

interface BookFormProps {
  book?: Book;
  onCancel: () => void;
}

export function BookForm({ book, onCancel }: BookFormProps) {
  const router = useRouter();
  const isEdit = !!book?.id;

  const [formData, setFormData] = useState<Book>({
    title: book?.title || "",
    description: book?.description || "",
    published_date: formatDateForInput(book?.published_date),
    authorId: book?.authorId || "",
  });
  const [coverImage, setCoverImage] = useState(book?.coverImage || "");

  const { data: authorsData } = useQuery(GET_AUTHORS, {
    variables: { limit: 100 },
    fetchPolicy: "network-only",
  });

  const [createBook, { loading: creating }] = useMutation(CREATE_BOOK, {
    update(cache, { data }) {
      if (!data?.createBook) return;
      const ITEMS_PER_PAGE = 12;
      const variables = { filter: "", offset: 0, limit: ITEMS_PER_PAGE };
      const existing = cache.readQuery({
        query: GET_BOOKS,
        variables,
      }) as { books?: any[] } | null;
      if (existing && Array.isArray(existing.books)) {
        cache.writeQuery({
          query: GET_BOOKS,
          variables,
          data: {
            books: [data.createBook, ...existing.books],
          },
        });
      }
    },
    onCompleted: (data) => {
      router.push(`/books/${data.createBook.id}`);
    },
  });

  const [updateBook, { loading: updating }] = useMutation(UPDATE_BOOK, {
    onCompleted: (data) => {
      router.push(`/books/${data.updateBook.id}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.authorId) {
      alert("Please fill in required fields");
      return;
    }

    try {
      const input = {
        title: formData.title,
        description: formData.description || undefined,
        published_date: formatDateForInput(formData.published_date),
        cover_image: coverImage || undefined,
      };

      if (isEdit && book?.id) {
        await updateBook({
          variables: { id: book.id, ...input, authorId: formData.authorId },
        });
      } else {
        await createBook({
          variables: { ...input, authorId: formData.authorId },
        });
      }
    } catch (error) {
      console.error("Error saving book:", error);
      alert("Error saving book. Please try again.");
    }
  };

  const handleInputChange = (field: keyof Book, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "published_date" ? formatDateForInput(value) : value,
    }));
  };

  const loading = creating || updating;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {isEdit ? "Edit Book" : "Add New Book"}
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter book title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Select
                value={formData.authorId}
                onValueChange={(value) => handleInputChange("authorId", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an author" />
                </SelectTrigger>
                <SelectContent>
                  {authorsData?.authors?.map((author: any) => (
                    <SelectItem key={author.id} value={author.id}>
                      {author.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="published_date">Published Date</Label>
              <Input
                id="published_date"
                type="date"
                value={formatDateForInput(formData.published_date)}
                onChange={(e) =>
                  handleInputChange("published_date", e.target.value)
                }
                placeholder="YYYY-MM-DD"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter book description..."
              rows={4}
            />
          </div>

          <ImageUpload
            label="Book Cover Image"
            onUpload={(url: any) => {
              setCoverImage(url);
            }}
          />
          {coverImage && (
            <img src={coverImage} alt="Book Cover" className="mt-2 h-32" />
          )}

          <div className="flex space-x-4 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isEdit ? "Update Book" : "Create Book"}
            </Button>

            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
