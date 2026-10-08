export default function StatusBadge({ status }) {
  const styles = {
    queued: "bg-border text-text-muted border-border",
    processing: "bg-accent/10 text-accent border-accent/20",
    done: "bg-success/10 text-success border-success/20",
    failed: "bg-error/10 text-error border-error/20",
  };

  const label = {
    queued: "Queued",
    processing: "Processing",
    done: "Completed",
    failed: "Failed",
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[status] || styles.queued}`}>
      {label[status] || status}
    </span>
  );
}
