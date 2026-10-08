const mimeExtensions = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

export async function downloadRow(row) {
  const response = await fetch(row.outputUrl);
  const blob = await response.blob();
  const extension = mimeExtensions[blob.type] || blob.type.split("/")[1] || "bin";
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${row.name}-${row.size}.${extension}`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function downloadAll(rows) {
  for (const row of rows) {
    if (row.status === "done") {
      await downloadRow(row);
    }
  }
}
