import { useState, useEffect } from "react";
import { resizeImage } from "../../utils/resizeImage.js";
import { getRatioLabel } from "../../utils/aspect.js";

export default function ImageUpload({ value, onChange, error, dimensions }) {
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
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full max-w-[160px] mx-auto flex items-center justify-center bg-main overflow-hidden">
        <div
          className={`
            relative transition-all duration-300 ease-in-out
            ${'motion-reduce:transition-none'}
            ${value?.previewUrl ? 'shadow-sm' : 'border-2 border-dashed border-border'}
          `}
          style={{
            aspectRatio: dimensions ? `${dimensions.width}/${dimensions.height}` : '1/1',
            width: '100%',
            maxHeight: '100%',
            maxWidth: '100%',
            objectFit: 'contain'
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
          />

          {!value?.previewUrl && !isProcessing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 space-y-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted"><path d="M21.44 11.05l-10.99-10.99a2 2 0 0 0-2.83 0l-10.99 10.99a2 2 0 0 0 0 2.83l10.99 10.99a2 2 0 0 0 2.83 0l10.99-10.99a2 2 0 0 0 0-2.83z"/><path d="m14 11 4 4"/><path d="m10 11 4 4"/></svg>
              <span className="text-[9px] font-bold uppercase tracking-wider text-text-muted">Upload image</span>
            </div>
          )}

          {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center bg-surface/50 backdrop-blur-sm">
              <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {value?.previewUrl && (
            <img
              src={value.previewUrl}
              alt={value.fileName || "Preview"}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <label className="cursor-pointer">
          <span className="inline-flex items-center justify-center rounded-ui border border-border bg-surface px-3 py-1 text-xs font-medium hover:border-accent/50 transition-colors">
            Choose file
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
          />
        </label>

        {dimensions && (
          <div className="text-center">
            <span className="text-[10px] font-medium text-text-muted tabular-nums">
              {dimensions.width} × {dimensions.height} · {getRatioLabel(dimensions.width, dimensions.height)}
            </span>
          </div>
        )}
      </div>

      {displayError && <p role="alert" className="text-error text-xs font-medium text-center">{displayError}</p>}
    </div>
  );
}
