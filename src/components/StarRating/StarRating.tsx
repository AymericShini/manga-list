import type { Rating } from "../../shared/types/manga";
import styles from "./StarRating.module.scss";

interface StarRatingProps {
  value: Rating | null;
  onChange?: (rating: Rating) => void;
  readOnly?: boolean;
  size?: "sm" | "md";
}

const STARS: Rating[] = [1, 2, 3, 4, 5];

export const StarRating = ({
  value,
  onChange,
  readOnly = false,
  size = "md",
}: StarRatingProps) => {
  return (
    <div
      className={[
        styles["star-rating"],
        styles[`star-rating--${size}`],
        readOnly ? styles["star-rating--readonly"] : "",
      ]
        .filter(Boolean)
        .join(" ")}
      role={readOnly ? "img" : "group"}
      aria-label={`Note : ${value ?? 0} sur 5`}
    >
      {STARS.map((star) => (
        <button
          key={star}
          type="button"
          className={[
            styles["star-rating__star"],
            value !== null && value >= star
              ? styles["star-rating__star--filled"]
              : styles["star-rating__star--empty"],
          ].join(" ")}
          onClick={() => !readOnly && onChange?.(star)}
          disabled={readOnly}
          aria-label={`${star} étoile${star > 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
};
