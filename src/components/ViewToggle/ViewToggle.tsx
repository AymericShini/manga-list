import type { ViewMode } from "../../shared/types/manga";
import styles from "./ViewToggle.module.scss";

interface ViewToggleProps {
  viewMode: ViewMode;
  onToggle: (mode: ViewMode) => void;
}

const VIEW_OPTIONS: { mode: ViewMode; label: string; icon: string }[] = [
  { mode: "table", label: "Tableau", icon: "☰" },
  { mode: "grid", label: "Cartes", icon: "⊞" },
];

export const ViewToggle = ({ viewMode, onToggle }: ViewToggleProps) => {
  return (
    <div
      className={styles["view-toggle"]}
      role="group"
      aria-label="Mode d'affichage"
    >
      {VIEW_OPTIONS.map(({ mode, label, icon }) => (
        <button
          key={mode}
          type="button"
          className={[
            styles["view-toggle__btn"],
            viewMode === mode ? styles["view-toggle__btn--active"] : "",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={() => onToggle(mode)}
          aria-pressed={viewMode === mode}
          aria-label={label}
          title={label}
        >
          <span className={styles["view-toggle__icon"]}>{icon}</span>
        </button>
      ))}
    </div>
  );
};
