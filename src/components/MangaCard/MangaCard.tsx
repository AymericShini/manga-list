import { useState } from "react";
import type { Manga, Rating } from "../../shared/types/manga";
import { resolveChapterUrl } from "../../shared/types/manga";
import { StarRating } from "../StarRating/StarRating";
import styles from "./MangaCard.module.scss";

interface MangaCardProps {
  manga: Manga;
  onUpdate: (manga: Manga) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onToggleHiatus: (id: string) => void;
  onIncrementChapter: (id: string) => void;
}

export const MangaCard = ({
  manga,
  onUpdate,
  onDelete,
  onToggleFavorite,
  onToggleHiatus,
  onIncrementChapter,
}: MangaCardProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<Manga>(manga);

  const handleEditStart = (): void => {
    setEditData(manga);
    setIsEditing(true);
  };

  const handleEditCancel = (): void => {
    setEditData(manga);
    setIsEditing(false);
  };

  const handleEditSave = (): void => {
    if (!editData.name.trim()) return;
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter") handleEditSave();
    if (e.key === "Escape") handleEditCancel();
  };

  const handleDeleteClick = (): void => {
    if (window.confirm(`Supprimer "${manga.name}" ?`)) {
      onDelete(manga.id);
    }
  };

  const resolvedUrl = manga.url
    ? resolveChapterUrl(manga.url, manga.chapter)
    : "";

  const cardClasses = [
    styles["manga-card"],
    manga.isHiatus ? styles["manga-card--hiatus"] : "",
    manga.isFavorite ? styles["manga-card--favorite"] : "",
    isEditing ? styles["manga-card--editing"] : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (isEditing) {
    return (
      <article className={cardClasses}>
        <div className={styles["manga-card__edit-body"]}>
          <input
            type="text"
            className={styles["manga-card__edit-input"]}
            value={editData.name}
            onChange={(e) =>
              setEditData((p) => ({ ...p, name: e.target.value }))
            }
            onKeyDown={handleKeyDown}
            placeholder="Nom *"
            autoFocus
            aria-label="Nom du manga"
          />
          <div className={styles["manga-card__edit-row"]}>
            <label className={styles["manga-card__edit-label"]}>Ch.</label>
            <input
              type="number"
              min={0}
              className={[
                styles["manga-card__edit-input"],
                styles["manga-card__edit-input--sm"],
              ].join(" ")}
              value={editData.chapter}
              onChange={(e) =>
                setEditData((p) => ({ ...p, chapter: Number(e.target.value) }))
              }
              onKeyDown={handleKeyDown}
              aria-label="Chapitre"
            />
          </div>
          <input
            type="url"
            className={styles["manga-card__edit-input"]}
            value={editData.url}
            onChange={(e) =>
              setEditData((p) => ({ ...p, url: e.target.value }))
            }
            onKeyDown={handleKeyDown}
            placeholder="https://.../{chapter}/..."
            aria-label="URL"
          />
          <StarRating
            value={editData.rating}
            onChange={(r: Rating) => setEditData((p) => ({ ...p, rating: r }))}
            size="sm"
          />
          <div className={styles["manga-card__edit-checks"]}>
            <label className={styles["manga-card__check-label"]}>
              <input
                type="checkbox"
                checked={editData.isFavorite}
                onChange={(e) =>
                  setEditData((p) => ({ ...p, isFavorite: e.target.checked }))
                }
              />
              ★ Favori
            </label>
            <label className={styles["manga-card__check-label"]}>
              <input
                type="checkbox"
                checked={editData.isHiatus}
                onChange={(e) =>
                  setEditData((p) => ({ ...p, isHiatus: e.target.checked }))
                }
              />
              ⏸ Hiatus
            </label>
          </div>
        </div>
        <div className={styles["manga-card__edit-actions"]}>
          <button
            type="button"
            className={[
              styles["manga-card__btn"],
              styles["manga-card__btn--cancel"],
            ].join(" ")}
            onClick={handleEditCancel}
          >
            Annuler
          </button>
          <button
            type="button"
            className={[
              styles["manga-card__btn"],
              styles["manga-card__btn--save"],
            ].join(" ")}
            onClick={handleEditSave}
          >
            Sauvegarder
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className={cardClasses}>
      {/* Badges */}
      <div className={styles["manga-card__badges"]}>
        {manga.isFavorite && (
          <span
            className={[
              styles["manga-card__badge"],
              styles["manga-card__badge--favorite"],
            ].join(" ")}
          >
            ★
          </span>
        )}
        {manga.isHiatus && (
          <span
            className={[
              styles["manga-card__badge"],
              styles["manga-card__badge--hiatus"],
            ].join(" ")}
          >
            Hiatus
          </span>
        )}
      </div>

      {/* Header */}
      <div className={styles["manga-card__header"]}>
        <h3 className={styles["manga-card__title"]}>{manga.name}</h3>
        <div className={styles["manga-card__chapter-group"]}>
          <span className={styles["manga-card__chapter"]}>
            Ch. {manga.chapter}
          </span>
          <button
            type="button"
            className={styles["manga-card__increment-btn"]}
            onClick={() => onIncrementChapter(manga.id)}
            title="Chapitre suivant (+1)"
            aria-label={`Passer au chapitre ${manga.chapter + 1}`}
          >
            +1
          </button>
        </div>
      </div>

      {/* Rating */}
      <div className={styles["manga-card__rating"]}>
        <StarRating value={manga.rating} readOnly size="sm" />
      </div>

      {/* Footer */}
      <div className={styles["manga-card__footer"]}>
        <div className={styles["manga-card__quick-actions"]}>
          <button
            type="button"
            className={[
              styles["manga-card__icon-btn"],
              manga.isFavorite
                ? styles["manga-card__icon-btn--favorite-active"]
                : styles["manga-card__icon-btn--favorite"],
            ].join(" ")}
            onClick={() => onToggleFavorite(manga.id)}
            title={
              manga.isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"
            }
            aria-pressed={manga.isFavorite}
          >
            ★
          </button>
          <button
            type="button"
            className={[
              styles["manga-card__icon-btn"],
              manga.isHiatus
                ? styles["manga-card__icon-btn--hiatus-active"]
                : styles["manga-card__icon-btn--hiatus"],
            ].join(" ")}
            onClick={() => onToggleHiatus(manga.id)}
            title={manga.isHiatus ? "Reprendre" : "Marquer en hiatus"}
            aria-pressed={manga.isHiatus}
          >
            ⏸
          </button>
        </div>

        <div className={styles["manga-card__main-actions"]}>
          {resolvedUrl && (
            <a
              href={resolvedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles["manga-card__read-btn"]}
              title={resolvedUrl}
            >
              Lire →
            </a>
          )}
          <button
            type="button"
            className={[
              styles["manga-card__action-btn"],
              styles["manga-card__action-btn--edit"],
            ].join(" ")}
            onClick={handleEditStart}
            title="Modifier"
            aria-label={`Modifier ${manga.name}`}
          >
            ✎
          </button>
          <button
            type="button"
            className={[
              styles["manga-card__action-btn"],
              styles["manga-card__action-btn--delete"],
            ].join(" ")}
            onClick={handleDeleteClick}
            title="Supprimer"
            aria-label={`Supprimer ${manga.name}`}
          >
            🗑
          </button>
        </div>
      </div>
    </article>
  );
};
