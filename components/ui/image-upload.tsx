"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  label?: string;
}

export function ImageUpload({
  onUpload,
  label = "Upload Image",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10MB.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("filename", `${Date.now()}-${file.name}`);

      const res = await fetch("/api/supabase-upload", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      const result = await res.json();
      if (result.url) {
        onUpload(result.url);
      } else {
        setError(result.error || "Failed to upload image.");
      }
    } catch (err) {
      setError("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div>
      <Label className="mb-2 block">{label}</Label>
      <Input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />
      <Button
        type="button"
        variant="outline"
        onClick={handleButtonClick}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Choose Image"}
      </Button>
      {error && <span className="text-red-600 ml-2">{error}</span>}
    </div>
  );
}
