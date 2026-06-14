"use client";

import Image from "next/image";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/lib/formatters";

type ImagePreviewProps = {
  file: File;
  previewUrl: string;
  onRemove: () => void;
};

export function ImagePreview({ file, previewUrl, onRemove }: ImagePreviewProps) {
  return (
    <section className="space-y-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
        <Image
          src={previewUrl}
          alt={`Preview of ${file.name}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 42vw"
          unoptimized
        />
      </div>
      <div className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-white p-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-zinc-950">{file.name}</p>
          <p className="text-xs text-zinc-500">{formatFileSize(file.size)}</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onRemove}
          aria-label="Remove image"
        >
          <X className="size-4" />
        </Button>
      </div>
    </section>
  );
}
