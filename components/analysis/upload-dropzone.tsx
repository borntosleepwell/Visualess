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
        "relative flex min-h-[320px] flex-col items-center justify-center overflow-hidden rounded-[1.75rem] border border-white/70 bg-[#171a16] p-8 text-center transition-colors sm:min-h-[370px] lg:min-h-[420px]",
        isDragActive && "border-lime-300 bg-[#20261b]",
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.24) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.24) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(23,26,22,0.72)_62%,#171a16_100%)]"
      />
      <input {...getInputProps()} />
      <div className="relative flex size-12 items-center justify-center rounded-full bg-black text-white">
        <ImageUp className="size-5" />
      </div>
      <h2 className="relative mt-5 text-2xl font-light text-zinc-50">
        Upload a design reference
      </h2>
      <p className="relative mt-3 max-w-md text-sm font-light leading-6 text-zinc-300">
        Drop a PNG, JPG, JPEG, or WEBP file here. Maximum upload size is 10MB.
      </p>
      <Button
        type="button"
        onClick={open}
        className="relative mt-6 rounded-full bg-black px-5 text-zinc-50 hover:bg-zinc-900"
      >
        choose image
      </Button>
    </section>
  );
}
