import { NextApiRequest, NextApiResponse } from "next";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.AWS_S3_BUCKET!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { filename, type } = req.body;

  if (!filename || !type) {
    return res.status(400).json({ error: "Missing filename or type" });
  }

  const key = `uploads/${Date.now()}-${filename}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: type,
  });

  try {
    const url = await getSignedUrl(s3, command, { expiresIn: 60 }); // 1 minute expiry
    res.status(200).json({ url, key });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate presigned URL" });
  }
}
