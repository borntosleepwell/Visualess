type RgbColor = {
  r: number;
  g: number;
  b: number;
};

function rgbToHex({ r, g, b }: RgbColor) {
  return `#${[r, g, b]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;
}

function colorDistance(a: RgbColor, b: RgbColor) {
  return Math.sqrt(
    (a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2,
  );
}

function createImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load image for palette."));
    image.src = src;
  });
}

export async function extractColorPalette(src: string, limit = 5) {
  const image = await createImage(src);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (!context) {
    return [];
  }

  const size = 96;
  const scale = Math.min(size / image.width, size / image.height);
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const buckets = new Map<string, { color: RgbColor; count: number }>();

  for (let index = 0; index < pixels.length; index += 16) {
    const alpha = pixels[index + 3];

    if (alpha < 180) {
      continue;
    }

    const color = {
      r: Math.round(pixels[index] / 24) * 24,
      g: Math.round(pixels[index + 1] / 24) * 24,
      b: Math.round(pixels[index + 2] / 24) * 24,
    };
    const key = `${color.r}-${color.g}-${color.b}`;
    const bucket = buckets.get(key);

    buckets.set(key, {
      color,
      count: bucket ? bucket.count + 1 : 1,
    });
  }

  const selected: RgbColor[] = [];

  for (const bucket of [...buckets.values()].sort((a, b) => b.count - a.count)) {
    if (selected.every((color) => colorDistance(color, bucket.color) > 54)) {
      selected.push(bucket.color);
    }

    if (selected.length === limit) {
      break;
    }
  }

  return selected.map(rgbToHex);
}
