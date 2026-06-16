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
      <div className="relative flex min-h-[320px] max-h-[52vh] overflow-hidden rounded-[1.75rem] border border-white/70 bg-[#171a16] sm:min-h-[370px] lg:min-h-[420px]">
        <Image
          src={previewUrl}
          alt={`Preview of ${file.name}`}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 42vw"
          unoptimized
        />
      </div>
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/20 bg-black/35 p-3 text-zinc-50">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{file.name}</p>
          <p className="text-xs font-light text-zinc-300">{formatFileSize(file.size)}</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onRemove}
          aria-label="Remove image"
          className="text-zinc-100 hover:bg-white/10 hover:text-white"
        >
          <X className="size-4" />
        </Button>
      </div>
    </section>
  );
}
