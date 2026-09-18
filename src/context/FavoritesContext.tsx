import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useSpaces } from "@/context/SpacesContext";
import type { Space } from "@/data/ocupa";

const STORAGE_KEY = "ocupa:favorites";

type FavoritesContextValue = {
  favoriteIds: number[];
  favorites: Space[];
  isReady: boolean;
  isFavorite: (spaceId: number) => boolean;
  toggleFavorite: (spaceId: number) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function sanitizeFavoriteIds(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  return [
    ...new Set(value.filter((id): id is number => typeof id === "number" && Number.isInteger(id))),
  ];
}

function persistFavoriteIds(ids: number[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // O estado em memória continua funcionando quando o armazenamento está indisponível.
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { spaces, getSpaceById } = useSpaces();
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Futuramente, carregar os IDs com GET /api/favorites/ para o usuário autenticado.
    try {
      const storedValue = window.localStorage.getItem(STORAGE_KEY);
      const parsedValue: unknown = storedValue ? JSON.parse(storedValue) : [];
      const validIds = sanitizeFavoriteIds(parsedValue);
      setFavoriteIds(validIds);
    } catch {
      setFavoriteIds([]);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (isReady) persistFavoriteIds(favoriteIds);
  }, [favoriteIds, isReady]);

  const isFavorite = useCallback((spaceId: number) => favoriteIds.includes(spaceId), [favoriteIds]);

  const toggleFavorite = useCallback(
    (spaceId: number) => {
      if (!spaces.some((space) => space.id === spaceId)) return;

      setFavoriteIds((current) => {
        // Futuramente, substituir esta mutação por POST/DELETE /api/favorites/ do Django/DRF.
        return current.includes(spaceId)
          ? current.filter((id) => id !== spaceId)
          : [...current, spaceId];
      });
    },
    [spaces],
  );

  const favorites = useMemo(
    () =>
      favoriteIds.map((id) => getSpaceById(id)).filter((space): space is Space => Boolean(space)),
    [favoriteIds, getSpaceById],
  );

  const value = useMemo(
    () => ({ favoriteIds, favorites, isReady, isFavorite, toggleFavorite }),
    [favoriteIds, favorites, isFavorite, isReady, toggleFavorite],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

// Provider e hook permanecem juntos para manter a fronteira de dados de favoritos coesa.
// eslint-disable-next-line react-refresh/only-export-components
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites precisa estar dentro de FavoritesProvider");
  return context;
}
