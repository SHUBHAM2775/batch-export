export async function resizeImage(file, maxEdge = 2048) {
  if (!file || !file.type || !file.type.startsWith("image/")) {
    throw new Error("Selected file is not an image");
  }

  const bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;

  if (width <= maxEdge && height <= maxEdge) {
    return { blob: file, width, height };
  }

  const scale = maxEdge / Math.max(width, height);
  const targetWidth = Math.round(width * scale);
  const targetHeight = Math.round(height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);

  const mimeType = file.type || "image/jpeg";

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob((result) => {
      if (result) {
        resolve(result);
      } else {
        canvas.toBlob((fallbackResult) => {
          if (fallbackResult) {
            resolve(fallbackResult);
          } else {
            reject(new Error("Failed to encode image to Blob"));
          }
        }, "image/jpeg");
      }
    }, mimeType);
  });

  return {
    blob,
    width: targetWidth,
    height: targetHeight,
  };
}
