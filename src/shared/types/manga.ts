export type Rating = 1 | 2 | 3 | 4 | 5;

export type ViewMode = "table" | "grid";

export type SortField = "name" | "chapter" | "createdAt";

export type SortDirection = "asc" | "desc";

export type Theme = "dark" | "light";

export interface Manga {
  id: string;
  name: string;
  chapter: number;
  url: string;
  isFavorite: boolean;
  isHiatus: boolean;
  rating: Rating | null;
  createdAt: string;
}

export type MangaFormData = Omit<Manga, "id" | "createdAt">;

export interface FilterState {
  search: string;
  onlyFavorites: boolean;
}

export interface SortState {
  field: SortField;
  direction: SortDirection;
}

export interface MangaState {
  mangas: Manga[];
  filter: FilterState;
  sort: SortState;
  viewMode: ViewMode;
}

export type MangaAction =
  | { type: "ADD_MANGA"; payload: Manga }
  | { type: "UPDATE_MANGA"; payload: Manga }
  | { type: "DELETE_MANGA"; payload: string }
  | { type: "TOGGLE_FAVORITE"; payload: string }
  | { type: "TOGGLE_HIATUS"; payload: string }
  | { type: "INCREMENT_CHAPTER"; payload: string }
  | { type: "SET_FILTER"; payload: Partial<FilterState> }
  | { type: "SET_SORT"; payload: SortState }
  | { type: "SET_VIEW_MODE"; payload: ViewMode }
  | { type: "IMPORT_MANGAS"; payload: Manga[] };

export const resolveChapterUrl = (url: string, chapter: number): string =>
  url.replace(/\{chapter\}/gi, String(chapter));
