import type { Manga, ViewMode } from "../../shared/types/manga";
import { MangaRow } from "../MangaRow/MangaRow";
import { MangaCard } from "../MangaCard/MangaCard";
import styles from "./MangaList.module.scss";

interface MangaListProps {
  mangas: Manga[];
  viewMode: ViewMode;
  onUpdate: (manga: Manga) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onToggleHiatus: (id: string) => void;
  onIncrementChapter: (id: string) => void;
}

const COLUMN_HEADERS = [
  { key: "name", label: "Nom" },
  { key: "chapter", label: "Chapitre" },
  { key: "url", label: "Lecture" },
  { key: "rating", label: "Note" },
  { key: "favorite", label: "★" },
  { key: "hiatus", label: "⏸" },
  { key: "actions", label: "" },
] as const;

const EmptyState = () => (
  <div className={styles["manga-list__empty"]}>
    <span className={styles["manga-list__empty-icon"]}>📚</span>
    <p className={styles["manga-list__empty-title"]}>Aucun manga trouvé</p>
    <p className={styles["manga-list__empty-sub"]}>
      Ajoutez votre premier manga ou modifiez vos filtres.
    </p>
  </div>
);

export const MangaList = ({
  mangas,
  viewMode,
  onUpdate,
  onDelete,
  onToggleFavorite,
  onToggleHiatus,
  onIncrementChapter,
}: MangaListProps) => {
  if (mangas.length === 0) return <EmptyState />;

  const sharedProps = {
    onUpdate,
    onDelete,
    onToggleFavorite,
    onToggleHiatus,
    onIncrementChapter,
  };

  if (viewMode === "grid") {
    return (
      <div className={styles["manga-list__grid"]}>
        {mangas.map((manga) => (
          <MangaCard key={manga.id} manga={manga} {...sharedProps} />
        ))}
      </div>
    );
  }

  return (
    <div className={styles["manga-list__table-wrapper"]}>
      <table className={styles["manga-list__table"]}>
        <thead>
          <tr className={styles["manga-list__header-row"]}>
            {COLUMN_HEADERS.map(({ key, label }) => (
              <th key={key} className={styles["manga-list__th"]}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mangas.map((manga) => (
            <MangaRow key={manga.id} manga={manga} {...sharedProps} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
