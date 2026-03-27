import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
  type Dispatch,
} from "react";
import type { MangaState, MangaAction } from "../shared/types/manga";
import { mangaReducer, initialState } from "../reducers/MangaReducer";
import { storageService } from "../services/Storageservice";

interface MangaContextValue {
  state: MangaState;
  dispatch: Dispatch<MangaAction>;
}

const MangaContext = createContext<MangaContextValue | null>(null);

interface MangaProviderProps {
  children: ReactNode;
}

export const MangaProvider = ({ children }: MangaProviderProps) => {
  const [state, dispatch] = useReducer(mangaReducer, initialState, (init) => ({
    ...init,
    mangas: storageService.getAll(),
  }));

  // Sync to localStorage on every mangas change
  useEffect(() => {
    storageService.save(state.mangas);
  }, [state.mangas]);

  return (
    <MangaContext.Provider value={{ state, dispatch }}>
      {children}
    </MangaContext.Provider>
  );
};

export const useMangaContext = (): MangaContextValue => {
  const context = useContext(MangaContext);
  if (!context) {
    throw new Error("useMangaContext must be used within a MangaProvider");
  }
  return context;
};
