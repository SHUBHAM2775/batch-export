export default function Button({ children, onClick, disabled, type = "button", variant = "primary", className = "" }) {
  const baseStyles = "px-4 py-2 rounded-ui font-medium transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:grayscale flex items-center justify-center gap-2";

  const variants = {
    primary: "bg-accent text-white hover:brightness-110 focus:ring-2 focus:ring-accent/40 focus:outline-none",
    secondary: "bg-surface border border-border text-text-main hover:bg-main focus:ring-2 focus:ring-accent/40 focus:outline-none",
    ghost: "text-text-muted hover:text-text-main hover:bg-main px-2 py-1 rounded-ui focus:ring-2 focus:ring-accent/40 focus:outline-none",
    outline: "border border-border text-text-main hover:bg-main focus:ring-2 focus:ring-accent/40 focus:outline-none"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
    >
      {children}
    </button>
  );
}
