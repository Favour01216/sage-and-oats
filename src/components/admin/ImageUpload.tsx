"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) return;

    setUploading(true);
    try {
      // Get signature from API
      const signResponse = await fetch("/api/cloudinary/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: "recipes" }),
      });
      const { signature, timestamp, cloudName, apiKey } = await signResponse.json();

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", signature);
      formData.append("timestamp", timestamp);
      formData.append("api_key", apiKey);
      formData.append("folder", "recipes");

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );
      const data = await uploadResponse.json();
      onChange(data.secure_url);
    } catch (error) {
      console.error("Upload failed:", error);
    }
    setUploading(false);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  return (
    <div>
      {value ? (
        <div className="relative">
          <Image
            src={value}
            alt="Recipe hero"
            width={400}
            height={300}
            className="h-48 w-full rounded-lg object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 rounded-full bg-white p-1 shadow-lg hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={e => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            dragActive ? "border-primary bg-primary/5" : "border-gray-300"
          } ${uploading ? "opacity-50" : ""}`}
        >
          <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <p className="mb-2 text-sm text-gray-600">
            Drag and drop an image here, or click to select
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            disabled={uploading}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="inline-block cursor-pointer rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
          >
            {uploading ? "Uploading..." : "Choose File"}
          </label>
        </div>
      )}
    </div>
  );
}
