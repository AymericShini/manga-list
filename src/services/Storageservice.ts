/**
 * storageService — Abstraction layer over localStorage.
 * To migrate to a REST API: replace each method body with a fetch() call.
 * The rest of the app stays untouched.
 */

import type { Manga } from "../shared/types/manga";

const STORAGE_KEY = "mangaTracker_v1";

const getAll = (): Manga[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Manga[];
  } catch {
    console.error("[storageService] Failed to parse localStorage data");
    return [];
  }
};

const save = (mangas: Manga[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mangas));
  } catch {
    console.error("[storageService] Failed to write to localStorage");
  }
};

const exportJson = (mangas: Manga[]): void => {
  const blob = new Blob([JSON.stringify(mangas, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `manga-tracker-${new Date().toISOString().split("T")[0]}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
};

const importJson = (file: File): Promise<Manga[]> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string) as Manga[];
        if (!Array.isArray(parsed)) {
          reject(
            new Error("Le fichier JSON doit contenir un tableau de mangas."),
          );
          return;
        }
        resolve(parsed);
      } catch {
        reject(new Error("Fichier JSON invalide."));
      }
    };
    reader.onerror = () => reject(new Error("Erreur de lecture du fichier."));
    reader.readAsText(file);
  });

export const storageService = {
  getAll,
  save,
  exportJson,
  importJson,
} as const;
