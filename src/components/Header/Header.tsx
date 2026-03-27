import type { Theme, ViewMode } from "../../shared/types/manga";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";
import { ViewToggle } from "../ViewToggle/ViewToggle";
import styles from "./Header.module.scss";

interface HeaderProps {
  theme: Theme;
  viewMode: ViewMode;
  onToggleTheme: () => void;
  onToggleView: (mode: ViewMode) => void;
}

export const Header = ({
  theme,
  viewMode,
  onToggleTheme,
  onToggleView,
}: HeaderProps) => {
  return (
    <header className={styles["header"]}>
      <div className={styles["header__brand"]}>
        <span className={styles["header__logo"]}>漫</span>
        <div className={styles["header__titles"]}>
          <h1 className={styles["header__title"]}>MangaTracker</h1>
          <p className={styles["header__subtitle"]}>Ta liste de lecture</p>
        </div>
      </div>
      <div className={styles["header__controls"]}>
        <ViewToggle viewMode={viewMode} onToggle={onToggleView} />
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </header>
  );
};
