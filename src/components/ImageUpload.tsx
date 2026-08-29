"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Upload } from "lucide-react";

interface ImageUploadProps {
  onUpload: (url: string) => void;
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  return (
    <CldUploadWidget
      uploadPreset="ml_default"
      onSuccess={(result) => {
        if (typeof result?.info === "object" && result?.info && "secure_url" in result.info) {
          onUpload((result.info as { secure_url: string }).secure_url);
        }
      }}
    >
      {({ open }) => (
        <button
          type="button"
          onClick={() => open()}
          className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-md hover:border-indigo-500 hover:bg-gray-50"
        >
          <Upload size={20} />
          <span>Upload Image</span>
        </button>
      )}
    </CldUploadWidget>
  );
}
