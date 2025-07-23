import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  // Get Supabase auth token from cookies or headers
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Optionally, verify token with Supabase
  const { data: user, error: userError } = await supabase.auth.getUser(token);
  if (userError || !user) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const data = await req.formData();
  const file = data.get("file") as File;
  const filename = data.get("filename") as string;

  if (!file || !filename) {
    return NextResponse.json(
      { error: "Missing file or filename" },
      { status: 400 }
    );
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Image size must be less than 10MB." },
      { status: 400 }
    );
  }

  const { data: uploadData, error } = await supabase.storage
    .from("book-keeper")
    .upload(filename, file, { upsert: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { publicUrl } = supabase.storage
    .from("book-keeper")
    .getPublicUrl(filename).data;

  return NextResponse.json({ url: publicUrl }, { status: 200 });
}
