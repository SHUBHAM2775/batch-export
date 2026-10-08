import Button from "./Button.jsx";

export default function ThemeToggle({ theme, onToggle }) {
  return <Button onClick={onToggle}>{theme}</Button>;
}
