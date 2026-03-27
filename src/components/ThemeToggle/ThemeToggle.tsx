import type { Theme } from "../../shared/types/manga";
import styles from "./ThemeToggle.module.scss";

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export const ThemeToggle = ({ theme, onToggle }: ThemeToggleProps) => {
  return (
    <button
      type="button"
      className={styles["theme-toggle"]}
      onClick={onToggle}
      aria-label={`Passer en mode ${theme === "dark" ? "clair" : "sombre"}`}
      title={`Mode ${theme === "dark" ? "clair" : "sombre"}`}
    >
      <span className={styles["theme-toggle__icon"]}>
        {theme === "dark" ? "☀️" : "🌙"}
      </span>
    </button>
  );
};
