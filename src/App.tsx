import { MangaProvider } from "./context/MangaContext";
import { useTheme } from "./hooks/useTheme";
import { useManga } from "./hooks/useManga";
import { Header } from "./components/Header/Header";
import { FilterBar } from "./components/FilterBar/FilterBar";
import { MangaForm } from "./components/MangaForm/MangaForm";
import { MangaList } from "./components/MangaList/MangaList";
import styles from "./App.module.scss";

// Inner component — needs to be inside MangaProvider to access context
const AppContent = () => {
  const { theme, toggleTheme } = useTheme();
  const {
    mangas,
    totalCount,
    filter,
    sort,
    viewMode,
    addManga,
    updateManga,
    deleteManga,
    toggleFavorite,
    toggleHiatus,
    setFilter,
    setSort,
    setViewMode,
    importMangas,
    exportMangas,
    incrementChapter,
  } = useManga();

  const handleImport = async (file: File): Promise<void> => {
    try {
      await importMangas(file);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur lors de l'import.");
    }
  };

  return (
    <div className={styles["app"]}>
      <Header
        theme={theme}
        viewMode={viewMode}
        onToggleTheme={toggleTheme}
        onToggleView={setViewMode}
      />

      <main className={styles["app__main"]}>
        <FilterBar
          filter={filter}
          sort={sort}
          totalCount={totalCount}
          filteredCount={mangas.length}
          onFilterChange={setFilter}
          onSortChange={setSort}
          onImport={handleImport}
          onExport={exportMangas}
        />

        <div className={styles["app__add-section"]}>
          <MangaForm onSubmit={addManga} />
        </div>

        <MangaList
          mangas={mangas}
          viewMode={viewMode}
          onUpdate={updateManga}
          onDelete={deleteManga}
          onToggleFavorite={toggleFavorite}
          onToggleHiatus={toggleHiatus}
          onIncrementChapter={incrementChapter}
        />
      </main>
    </div>
  );
};

const App = () => (
  <MangaProvider>
    <AppContent />
  </MangaProvider>
);

export default App;
