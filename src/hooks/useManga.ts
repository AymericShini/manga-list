import { useMemo } from "react";
import type {
  Manga,
  MangaFormData,
  SortState,
  FilterState,
  ViewMode,
} from "../shared/types/manga";
import { useMangaContext } from "../context/MangaContext";
import { storageService } from "../services/Storageservice";

const generateId = (): string => crypto.randomUUID();

export const useManga = () => {
  const { state, dispatch } = useMangaContext();

  const addManga = (formData: MangaFormData): void => {
    const newManga: Manga = {
      ...formData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: "ADD_MANGA", payload: newManga });
  };

  const updateManga = (manga: Manga): void => {
    dispatch({ type: "UPDATE_MANGA", payload: manga });
  };

  const deleteManga = (id: string): void => {
    dispatch({ type: "DELETE_MANGA", payload: id });
  };

  const toggleFavorite = (id: string): void => {
    dispatch({ type: "TOGGLE_FAVORITE", payload: id });
  };

  const toggleHiatus = (id: string): void => {
    dispatch({ type: "TOGGLE_HIATUS", payload: id });
  };

  const incrementChapter = (id: string): void => {
    dispatch({ type: "INCREMENT_CHAPTER", payload: id });
  };

  const setFilter = (filter: Partial<FilterState>): void => {
    dispatch({ type: "SET_FILTER", payload: filter });
  };

  const setSort = (sort: SortState): void => {
    dispatch({ type: "SET_SORT", payload: sort });
  };

  const setViewMode = (viewMode: ViewMode): void => {
    dispatch({ type: "SET_VIEW_MODE", payload: viewMode });
  };

  const importMangas = async (file: File): Promise<void> => {
    const imported = await storageService.importJson(file);
    dispatch({ type: "IMPORT_MANGAS", payload: imported });
  };

  const exportMangas = (): void => {
    storageService.exportJson(state.mangas);
  };

  const filteredAndSortedMangas = useMemo((): Manga[] => {
    let result = [...state.mangas];

    if (state.filter.search.trim()) {
      const search = state.filter.search.toLowerCase();
      result = result.filter((m) => m.name.toLowerCase().includes(search));
    }

    if (state.filter.onlyFavorites) {
      result = result.filter((m) => m.isFavorite);
    }

    result.sort((a, b) => {
      const { field, direction } = state.sort;
      const multiplier = direction === "asc" ? 1 : -1;

      if (field === "name") {
        return a.name.localeCompare(b.name) * multiplier;
      }
      if (field === "chapter") {
        return (a.chapter - b.chapter) * multiplier;
      }
      // createdAt
      return (
        (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) *
        multiplier
      );
    });

    return result;
  }, [state.mangas, state.filter, state.sort]);

  return {
    mangas: filteredAndSortedMangas,
    totalCount: state.mangas.length,
    filter: state.filter,
    sort: state.sort,
    viewMode: state.viewMode,
    addManga,
    updateManga,
    deleteManga,
    toggleFavorite,
    toggleHiatus,
    setFilter,
    setSort,
    incrementChapter,
    setViewMode,
    importMangas,
    exportMangas,
  };
};
