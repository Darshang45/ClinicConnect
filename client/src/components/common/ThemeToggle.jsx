import useTheme from "../../hooks/useTheme";

function ThemeToggle({ className = "", ...props }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={className}
      type="button"
      onClick={toggleTheme}
      {...props}
    >
      <span className="material-symbols-outlined" aria-hidden="true">
        {isDark ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
}

export default ThemeToggle;
