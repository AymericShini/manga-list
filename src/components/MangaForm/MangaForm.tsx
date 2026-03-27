import { useState } from "react";
import type { MangaFormData, Rating } from "../../shared/types/manga";
import { StarRating } from "../StarRating/StarRating";
import styles from "./MangaForm.module.scss";

interface MangaFormProps {
  onSubmit: (data: MangaFormData) => void;
}

const defaultFormData: MangaFormData = {
  name: "",
  chapter: 1,
  url: "",
  isFavorite: false,
  isHiatus: false,
  rating: null,
};

export const MangaForm = ({ onSubmit }: MangaFormProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<MangaFormData>(defaultFormData);
  const [errors, setErrors] = useState<
    Partial<Record<keyof MangaFormData, string>>
  >({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof MangaFormData, string>> = {};
    if (!formData.name.trim()) newErrors.name = "Le nom est requis.";
    if (formData.chapter < 0)
      newErrors.chapter = "Le chapitre doit être positif.";
    if (formData.url && !/^https?:\/\/.+/.test(formData.url)) {
      newErrors.url = "L'URL doit commencer par http:// ou https://";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
    setFormData(defaultFormData);
    setErrors({});
    setIsOpen(false);
  };

  const handleCancel = (): void => {
    setFormData(defaultFormData);
    setErrors({});
    setIsOpen(false);
  };

  const handleStringChange =
    (field: keyof Pick<MangaFormData, "name" | "url">) =>
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleChapterChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setFormData((prev) => ({ ...prev, chapter: Number(e.target.value) }));
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        className={styles["manga-form__open-btn"]}
        onClick={() => setIsOpen(true)}
      >
        <span>+</span> Ajouter un manga
      </button>
    );
  }

  return (
    <div className={styles["manga-form"]}>
      <h2 className={styles["manga-form__title"]}>Nouveau manga</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className={styles["manga-form__grid"]}>
          {/* Name */}
          <div className={styles["manga-form__field"]}>
            <label className={styles["manga-form__label"]} htmlFor="manga-name">
              Nom *
            </label>
            <input
              id="manga-name"
              type="text"
              className={[
                styles["manga-form__input"],
                errors.name ? styles["manga-form__input--error"] : "",
              ]
                .filter(Boolean)
                .join(" ")}
              value={formData.name}
              onChange={handleStringChange("name")}
              placeholder="One Piece, Naruto..."
              autoFocus
            />
            {errors.name && (
              <span className={styles["manga-form__error"]}>{errors.name}</span>
            )}
          </div>

          {/* Chapter */}
          <div className={styles["manga-form__field"]}>
            <label
              className={styles["manga-form__label"]}
              htmlFor="manga-chapter"
            >
              Chapitre
            </label>
            <input
              id="manga-chapter"
              type="number"
              min={0}
              className={[
                styles["manga-form__input"],
                errors.chapter ? styles["manga-form__input--error"] : "",
              ]
                .filter(Boolean)
                .join(" ")}
              value={formData.chapter}
              onChange={handleChapterChange}
            />
            {errors.chapter && (
              <span className={styles["manga-form__error"]}>
                {errors.chapter}
              </span>
            )}
          </div>

          {/* URL */}
          <div
            className={[
              styles["manga-form__field"],
              styles["manga-form__field--full"],
            ].join(" ")}
          >
            <label className={styles["manga-form__label"]} htmlFor="manga-url">
              URL de lecture
            </label>
            <input
              id="manga-url"
              type="url"
              className={[
                styles["manga-form__input"],
                errors.url ? styles["manga-form__input--error"] : "",
              ]
                .filter(Boolean)
                .join(" ")}
              value={formData.url}
              onChange={handleStringChange("url")}
              placeholder="https://..."
            />
            {errors.url && (
              <span className={styles["manga-form__error"]}>{errors.url}</span>
            )}
          </div>

          {/* Rating */}
          <div className={styles["manga-form__field"]}>
            <label className={styles["manga-form__label"]}>Note</label>
            <StarRating
              value={formData.rating}
              onChange={(r: Rating) =>
                setFormData((prev) => ({ ...prev, rating: r }))
              }
            />
          </div>

          {/* Checkboxes */}
          <div
            className={[
              styles["manga-form__field"],
              styles["manga-form__field--row"],
            ].join(" ")}
          >
            <label className={styles["manga-form__checkbox-label"]}>
              <input
                type="checkbox"
                checked={formData.isFavorite}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isFavorite: e.target.checked,
                  }))
                }
              />
              ★ Favori
            </label>
            <label className={styles["manga-form__checkbox-label"]}>
              <input
                type="checkbox"
                checked={formData.isHiatus}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isHiatus: e.target.checked,
                  }))
                }
              />
              ⏸ Hiatus
            </label>
          </div>
        </div>

        <div className={styles["manga-form__actions"]}>
          <button
            type="button"
            className={styles["manga-form__btn-cancel"]}
            onClick={handleCancel}
          >
            Annuler
          </button>
          <button type="submit" className={styles["manga-form__btn-submit"]}>
            Ajouter
          </button>
        </div>
      </form>
    </div>
  );
};
