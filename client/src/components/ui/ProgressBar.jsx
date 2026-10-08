export default function ProgressBar({ value }) {
  return (
    <div className="w-full h-1 bg-border rounded-full overflow-hidden">
      <div
        className="h-full bg-accent transition-all duration-500 ease-out"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
