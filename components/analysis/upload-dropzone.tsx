"use client";

import { ImageUp } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";
import { uploadSchema } from "@/lib/validation/analysis-schema";
import { cn } from "@/lib/utils";

type UploadDropzoneProps = {
  onFileAccepted: (file: File) => void;
  onError: (message: string) => void;
};

export function UploadDropzone({
  onFileAccepted,
  onError,
}: UploadDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (!file) {
        return;
      }

      // File validation stays at the upload boundary before preview or API calls happen.
      const result = uploadSchema.safeParse({ file });

      if (!result.success) {
        onError(result.error.issues[0]?.message ?? "Invalid image file.");
        return;
      }

      onFileAccepted(file);
    },
    [onError, onFileAccepted],
  );

  const { getInputProps, getRootProps, isDragActive, open } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    multiple: false,
    noClick: true,
    onDrop,
  });

  return (
    <section
      {...getRootProps()}
      className={cn(
        "flex min-h-[320px] flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center transition-colors",
        isDragActive && "border-cyan-400 bg-cyan-50",
      )}
    >
      <input {...getInputProps()} />
      <div className="flex size-12 items-center justify-center rounded-lg bg-zinc-950 text-white">
        <ImageUp className="size-5" />
      </div>
      <h2 className="mt-5 text-xl font-semibold text-zinc-950">
        Upload a design reference
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
        Drop a PNG, JPG, JPEG, or WEBP file here. Maximum upload size is 10MB.
      </p>
      <Button
        type="button"
        onClick={open}
        className="mt-6"
      >
        Choose image
      </Button>
    </section>
  );
}
