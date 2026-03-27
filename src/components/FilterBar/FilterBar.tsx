import type {
  FilterState,
  SortState,
  SortField,
  SortDirection,
} from "../../shared/types/manga";
import styles from "./FilterBar.module.scss";

interface FilterBarProps {
  filter: FilterState;
  sort: SortState;
  totalCount: number;
  filteredCount: number;
  onFilterChange: (filter: Partial<FilterState>) => void;
  onSortChange: (sort: SortState) => void;
  onImport: (file: File) => void;
  onExport: () => void;
}

const SORT_OPTIONS: { field: SortField; label: string }[] = [
  { field: "createdAt", label: "Date ajout" },
  { field: "name", label: "Nom" },
  { field: "chapter", label: "Chapitre" },
];

export const FilterBar = ({
  filter,
  sort,
  totalCount,
  filteredCount,
  onFilterChange,
  onSortChange,
  onImport,
  onExport,
}: FilterBarProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      e.target.value = "";
    }
  };

  const handleSortFieldChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ): void => {
    onSortChange({ ...sort, field: e.target.value as SortField });
  };

  const toggleSortDirection = (): void => {
    const nextDirection: SortDirection =
      sort.direction === "asc" ? "desc" : "asc";
    onSortChange({ ...sort, direction: nextDirection });
  };

  return (
    <div className={styles["filter-bar"]}>
      <div className={styles["filter-bar__left"]}>
        {/* Search */}
        <div className={styles["filter-bar__search"]}>
          <span className={styles["filter-bar__search-icon"]}>🔍</span>
          <input
            type="text"
            className={styles["filter-bar__search-input"]}
            placeholder="Rechercher un manga..."
            value={filter.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            aria-label="Rechercher par nom"
          />
          {filter.search && (
            <button
              type="button"
              className={styles["filter-bar__search-clear"]}
              onClick={() => onFilterChange({ search: "" })}
              aria-label="Effacer la recherche"
            >
              ✕
            </button>
          )}
        </div>

        {/* Favorites toggle */}
        <button
          type="button"
          className={[
            styles["filter-bar__toggle"],
            filter.onlyFavorites ? styles["filter-bar__toggle--active"] : "",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={() =>
            onFilterChange({ onlyFavorites: !filter.onlyFavorites })
          }
          aria-pressed={filter.onlyFavorites}
        >
          ★ Favoris
        </button>

        {/* Count */}
        <span className={styles["filter-bar__count"]}>
          {filteredCount === totalCount
            ? `${totalCount} manga${totalCount > 1 ? "s" : ""}`
            : `${filteredCount} / ${totalCount}`}
        </span>
      </div>

      <div className={styles["filter-bar__right"]}>
        {/* Sort */}
        <div className={styles["filter-bar__sort"]}>
          <select
            className={styles["filter-bar__sort-select"]}
            value={sort.field}
            onChange={handleSortFieldChange}
            aria-label="Trier par"
          >
            {SORT_OPTIONS.map(({ field, label }) => (
              <option key={field} value={field}>
                {label}
              </option>
            ))}
          </select>
          <button
            type="button"
            className={styles["filter-bar__sort-dir"]}
            onClick={toggleSortDirection}
            aria-label={`Ordre ${sort.direction === "asc" ? "croissant" : "décroissant"}`}
            title={`Ordre ${sort.direction === "asc" ? "croissant" : "décroissant"}`}
          >
            {sort.direction === "asc" ? "↑" : "↓"}
          </button>
        </div>

        {/* Import */}
        <label className={styles["filter-bar__btn"]} title="Importer JSON">
          <input
            type="file"
            accept=".json,application/json"
            className={styles["filter-bar__file-input"]}
            onChange={handleFileChange}
            aria-label="Importer un fichier JSON"
          />
          ↑ Import
        </label>

        {/* Export */}
        <button
          type="button"
          className={styles["filter-bar__btn"]}
          onClick={onExport}
          disabled={totalCount === 0}
          title="Exporter JSON"
        >
          ↓ Export
        </button>
      </div>
    </div>
  );
};
