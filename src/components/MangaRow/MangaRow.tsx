import { useState } from "react";
import type { Manga, Rating } from "../../shared/types/manga";
import { resolveChapterUrl } from "../../shared/types/manga";
import { StarRating } from "../StarRating/StarRating";
import styles from "./MangaRow.module.scss";


interface MangaRowProps {
  manga: Manga;
  onUpdate: (manga: Manga) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onToggleHiatus: (id: string) => void;
  onIncrementChapter: (id: string) => void;
}

export const MangaRow = ({
  manga,
  onUpdate,
  onDelete,
  onToggleFavorite,
  onToggleHiatus,
  onIncrementChapter,
}: MangaRowProps) => {
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
    if (e.key === 'Enter') handleEditSave();
    if (e.key === 'Escape') handleEditCancel();
  };

  const handleDeleteClick = (): void => {
    if (window.confirm(`Supprimer "${manga.name}" ?`)) {
      onDelete(manga.id);
    }
  };

  const resolvedUrl = manga.url ? resolveChapterUrl(manga.url, manga.chapter) : '';

  if (isEditing) {
    return (
      <tr className={[styles['manga-row'], styles['manga-row--editing']].join(' ')}>
        <td className={styles['manga-row__cell']}>
          <input
            type="text"
            className={styles['manga-row__edit-input']}
            value={editData.name}
            onChange={(e) => setEditData((p) => ({ ...p, name: e.target.value }))}
            onKeyDown={handleKeyDown}
            autoFocus
            aria-label="Nom du manga"
          />
        </td>
        <td className={styles['manga-row__cell']}>
          <input
            type="number"
            min={0}
            className={[styles['manga-row__edit-input'], styles['manga-row__edit-input--sm']].join(' ')}
            value={editData.chapter}
            onChange={(e) => setEditData((p) => ({ ...p, chapter: Number(e.target.value) }))}
            onKeyDown={handleKeyDown}
            aria-label="Chapitre"
          />
        </td>
        <td className={styles['manga-row__cell']}>
          <input
            type="url"
            className={styles['manga-row__edit-input']}
            value={editData.url}
            onChange={(e) => setEditData((p) => ({ ...p, url: e.target.value }))}
            onKeyDown={handleKeyDown}
            placeholder="https://.../{chapter}/..."
            aria-label="URL"
          />
        </td>
        <td className={styles['manga-row__cell']}>
          <StarRating
            value={editData.rating}
            onChange={(r: Rating) => setEditData((p) => ({ ...p, rating: r }))}
            size="sm"
          />
        </td>
        <td className={styles['manga-row__cell']} />
        <td className={styles['manga-row__cell']} />
        <td className={[styles['manga-row__cell'], styles['manga-row__cell--actions']].join(' ')}>
          <button
            type="button"
            className={[styles['manga-row__action-btn'], styles['manga-row__action-btn--save']].join(' ')}
            onClick={handleEditSave}
            title="Sauvegarder (Entrée)"
          >
            ✓
          </button>
          <button
            type="button"
            className={[styles['manga-row__action-btn'], styles['manga-row__action-btn--cancel']].join(' ')}
            onClick={handleEditCancel}
            title="Annuler (Échap)"
          >
            ✕
          </button>
        </td>
      </tr>
    );
  }

  return (
    <tr
      className={[
        styles['manga-row'],
        manga.isHiatus ? styles['manga-row--hiatus'] : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Nom */}
      <td className={styles['manga-row__cell']}>
        <span className={styles['manga-row__name']}>{manga.name}</span>
      </td>

      {/* Chapitre + bouton +1 */}
      <td className={styles['manga-row__cell']}>
        <div className={styles['manga-row__chapter-group']}>
          <span className={styles['manga-row__chapter']}>Ch. {manga.chapter}</span>
          <button
            type="button"
            className={styles['manga-row__increment-btn']}
            onClick={() => onIncrementChapter(manga.id)}
            title="Chapitre suivant (+1)"
            aria-label={`Passer au chapitre ${manga.chapter + 1}`}
          >
            +1
          </button>
        </div>
      </td>

      {/* URL résolue */}
      <td className={styles['manga-row__cell']}>
        {resolvedUrl ? (
          <a
            href={resolvedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles['manga-row__link']}
            title={resolvedUrl}
          >
            Lire →
          </a>
        ) : (
          <span className={styles['manga-row__empty']}>—</span>
        )}
      </td>

      {/* Note */}
      <td className={styles['manga-row__cell']}>
        <StarRating value={manga.rating} readOnly size="sm" />
      </td>

      {/* Favori */}
      <td className={styles['manga-row__cell']}>
        <button
          type="button"
          className={[
            styles['manga-row__icon-btn'],
            manga.isFavorite
              ? styles['manga-row__icon-btn--favorite-active']
              : styles['manga-row__icon-btn--favorite'],
          ].join(' ')}
          onClick={() => onToggleFavorite(manga.id)}
          title={manga.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          aria-label={manga.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          aria-pressed={manga.isFavorite}
        >
          ★
        </button>
      </td>

      {/* Hiatus */}
      <td className={styles['manga-row__cell']}>
        <button
          type="button"
          className={[
            styles['manga-row__icon-btn'],
            manga.isHiatus
              ? styles['manga-row__icon-btn--hiatus-active']
              : styles['manga-row__icon-btn--hiatus'],
          ].join(' ')}
          onClick={() => onToggleHiatus(manga.id)}
          title={manga.isHiatus ? 'Reprendre' : 'Marquer en hiatus'}
          aria-label={manga.isHiatus ? 'Reprendre' : 'Marquer en hiatus'}
          aria-pressed={manga.isHiatus}
        >
          ⏸
        </button>
      </td>

      {/* Actions */}
      <td className={[styles['manga-row__cell'], styles['manga-row__cell--actions']].join(' ')}>
        <button
          type="button"
          className={[styles['manga-row__action-btn'], styles['manga-row__action-btn--edit']].join(' ')}
          onClick={handleEditStart}
          title="Modifier"
          aria-label={`Modifier ${manga.name}`}
        >
          ✎
        </button>
        <button
          type="button"
          className={[styles['manga-row__action-btn'], styles['manga-row__action-btn--delete']].join(' ')}
          onClick={handleDeleteClick}
          title="Supprimer"
          aria-label={`Supprimer ${manga.name}`}
        >
          🗑
        </button>
      </td>
    </tr>
  );
};