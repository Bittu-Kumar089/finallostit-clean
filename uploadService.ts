// services/uploadService.ts

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function uploadImageAndSaveItem(
  file: File,
  title: string,
  token: string
) {
  // 1️⃣ Ask backend for presigned URL
  const res = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to get upload URL");
  }

  const { uploadUrl } = await res.json();

  // 2️⃣ Upload file to S3 (THIS WAS MISSING BEFORE)
  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!putRes.ok) {
    throw new Error("S3 upload failed");
  }

  // 3️⃣ Save item metadata in DynamoDB
  const itemRes = await fetch(`${API_BASE_URL}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      imageKey: file.name,
    }),
  });

  if (!itemRes.ok) {
    throw new Error("Saving item failed");
  }

  return await itemRes.json();
}
