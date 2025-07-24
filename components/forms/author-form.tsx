"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CREATE_AUTHOR, UPDATE_AUTHOR } from "@/lib/graphql/mutations";
import { GET_AUTHORS } from "@/lib/graphql/queries";
import { Loader2, Save, X } from "lucide-react";
import { formatDateForInput } from "@/lib/utils";
import { ImageUpload } from "@/components/ui/image-upload";

interface Author {
  id?: string;
  name: string;
  biography?: string;
  born_date?: string | number;
  avatar?: string;
}

interface AuthorFormProps {
  author?: Author;
  onCancel: () => void;
}

export function AuthorForm({ author, onCancel }: AuthorFormProps) {
  const router = useRouter();
  const isEdit = !!author?.id;

  const [formData, setFormData] = useState<Author>({
    name: author?.name || "",
    biography: author?.biography || "",
    born_date: formatDateForInput(author?.born_date),
    avatar: author?.avatar || "",
  });
  const [avatar, setAvatar] = useState(author?.avatar || "");

  const [createAuthor, { loading: creating }] = useMutation(CREATE_AUTHOR, {
    refetchQueries: [{ query: GET_AUTHORS }],
    onCompleted: (data) => {
      router.push(`/authors/${data.createAuthor.id}`);
    },
  });

  const [updateAuthor, { loading: updating }] = useMutation(UPDATE_AUTHOR, {
    onCompleted: (data) => {
      router.push(`/authors/${data.updateAuthor.id}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      alert("Please enter the author name");
      return;
    }

    // Convert born_date to timestamp if needed by backend
    let born_date_to_send: string | undefined = formData.born_date
      ? formatDateForInput(formData.born_date)
      : undefined;

    try {
      const input = {
        name: formData.name,
        biography: formData.biography || undefined,
        born_date: born_date_to_send,
        avatar,
      };

      if (isEdit && author?.id) {
        await updateAuthor({
          variables: { id: author.id, ...input },
        });
      } else {
        await createAuthor({
          variables: { ...input },
        });
      }
    } catch (error) {
      console.error("Error saving author:", error);
      alert("Error saving author. Please try again.");
    }
  };

  const handleInputChange = (field: keyof Author, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "born_date" ? formatDateForInput(value) : value,
    }));
  };

  const loading = creating || updating;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {isEdit ? "Edit Author" : "Add New Author"}
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter author name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="born_date">Born Date</Label>
              <Input
                id="born_date"
                type="date"
                value={formatDateForInput(formData.born_date)}
                onChange={(e) => handleInputChange("born_date", e.target.value)}
                placeholder="YYYY-MM-DD"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="biography">Biography</Label>
            <Textarea
              id="biography"
              value={formData.biography}
              onChange={(e) => handleInputChange("biography", e.target.value)}
              placeholder="Enter author biography..."
              rows={6}
            />
          </div>

          <ImageUpload
            label="Author Avatar"
            onUpload={(url) => setAvatar(url)}
          />
          {avatar && (
            <img
              src={avatar}
              alt="Author Avatar"
              className="mt-2 h-32 rounded-full"
            />
          )}

          <div className="flex space-x-4 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isEdit ? "Update Author" : "Create Author"}
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
