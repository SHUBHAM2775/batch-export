export default function ImageUpload({ value, onChange, error }) {
  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />
      {value?.previewUrl && (
        <img src={value.previewUrl} alt={value.fileName || "Preview"} />
      )}
      {value?.fileName && <span>{value.fileName}</span>}
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
