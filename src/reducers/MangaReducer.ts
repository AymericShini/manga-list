import type { MangaState, MangaAction } from "../shared/types/manga";

export const initialState: MangaState = {
  mangas: [],
  filter: {
    search: "",
    onlyFavorites: false,
  },
  sort: {
    field: "createdAt",
    direction: "desc",
  },
  viewMode: "table",
};

export const mangaReducer = (
  state: MangaState,
  action: MangaAction,
): MangaState => {
  switch (action.type) {
    case "ADD_MANGA":
      return { ...state, mangas: [...state.mangas, action.payload] };

    case "UPDATE_MANGA":
      return {
        ...state,
        mangas: state.mangas.map((m) =>
          m.id === action.payload.id ? action.payload : m,
        ),
      };

    case "DELETE_MANGA":
      return {
        ...state,
        mangas: state.mangas.filter((m) => m.id !== action.payload),
      };

    case "TOGGLE_FAVORITE":
      return {
        ...state,
        mangas: state.mangas.map((m) =>
          m.id === action.payload ? { ...m, isFavorite: !m.isFavorite } : m,
        ),
      };

    case "TOGGLE_HIATUS":
      return {
        ...state,
        mangas: state.mangas.map((m) =>
          m.id === action.payload ? { ...m, isHiatus: !m.isHiatus } : m,
        ),
      };

    case "INCREMENT_CHAPTER":
      return {
        ...state,
        mangas: state.mangas.map((m) =>
          m.id === action.payload ? { ...m, chapter: m.chapter + 1 } : m,
        ),
      };

    case "SET_FILTER":
      return {
        ...state,
        filter: { ...state.filter, ...action.payload },
      };

    case "SET_SORT":
      return { ...state, sort: action.payload };

    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.payload };

    case "IMPORT_MANGAS":
      return { ...state, mangas: action.payload };

    default:
      return state;
  }
};
