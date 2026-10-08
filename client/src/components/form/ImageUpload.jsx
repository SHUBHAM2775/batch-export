import { useState, useEffect } from "react";
import { resizeImage } from "../../utils/resizeImage.js";

export default function ImageUpload({ value, onChange, error }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    const currentUrl = value?.previewUrl;
    return () => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
    };
  }, [value?.previewUrl]);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLocalError(null);
    setIsProcessing(true);

    try {
      const { blob, width, height } = await resizeImage(file);
      const previewUrl = URL.createObjectURL(blob);
      onChange({
        blob,
        previewUrl,
        fileName: file.name,
        width,
        height,
      });
    } catch (err) {
      setLocalError(err.message || "Failed to process image");
    } finally {
      setIsProcessing(false);
    }
  };

  const displayError = error || localError;

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      {isProcessing && <p>Processing...</p>}
      {value?.previewUrl && (
        <img src={value.previewUrl} alt={value.fileName || "Preview"} />
      )}
      {value?.fileName && (
        <span>
          {value.fileName}
          {value.width && value.height ? ` (${value.width}x${value.height})` : ""}
        </span>
      )}
      {displayError && <p role="alert">{displayError}</p>}
    </div>
  );
}
