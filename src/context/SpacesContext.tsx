import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { spaces as mockSpaces, type Space } from "@/data/ocupa";

const STORAGE_KEY = "ocupa:published-spaces";

export type NewSpace = Omit<Space, "id" | "rating" | "reviews">;

type SpacesContextValue = {
  spaces: Space[];
  publishedSpaces: Space[];
  isReady: boolean;
  getSpaceById: (id: string | number) => Space | undefined;
  createSpace: (space: NewSpace) => Space;
};

const SpacesContext = createContext<SpacesContextValue | null>(null);

function isStoredSpace(value: unknown): value is Space {
  if (!value || typeof value !== "object") return false;
  const space = value as Partial<Space>;
  return (
    typeof space.id === "number" &&
    typeof space.name === "string" &&
    typeof space.ownerId === "string" &&
    typeof space.image === "string" &&
    Array.isArray(space.images)
  );
}

export function SpacesProvider({ children }: { children: ReactNode }) {
  const [publishedSpaces, setPublishedSpaces] = useState<Space[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      const parsed: unknown = stored ? JSON.parse(stored) : [];
      setPublishedSpaces(Array.isArray(parsed) ? parsed.filter(isStoredSpace) : []);
    } catch {
      setPublishedSpaces([]);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(publishedSpaces));
    } catch {
      // O estado em memória continua válido quando o armazenamento local está indisponível.
    }
  }, [isReady, publishedSpaces]);

  const spaces = useMemo(() => [...mockSpaces, ...publishedSpaces], [publishedSpaces]);

  const getSpaceById = useCallback(
    (id: string | number) => spaces.find((space) => String(space.id) === String(id)),
    [spaces],
  );

  const createSpace = useCallback(
    (input: NewSpace) => {
      // Futuramente, esta fronteira será substituída por POST /api/spaces/.
      const highestId = [...mockSpaces, ...publishedSpaces].reduce(
        (highest, space) => Math.max(highest, space.id),
        0,
      );
      const created: Space = { ...input, id: highestId + 1, rating: 0, reviews: 0 };
      setPublishedSpaces((current) => [...current, created]);
      return created;
    },
    [publishedSpaces],
  );

  const value = useMemo(
    () => ({ spaces, publishedSpaces, isReady, getSpaceById, createSpace }),
    [createSpace, getSpaceById, isReady, publishedSpaces, spaces],
  );

  return <SpacesContext.Provider value={value}>{children}</SpacesContext.Provider>;
}

// Provider e hook compartilham a mesma fronteira de dados dos anúncios.
// eslint-disable-next-line react-refresh/only-export-components
export function useSpaces() {
  const context = useContext(SpacesContext);
  if (!context) throw new Error("useSpaces precisa estar dentro de SpacesProvider");
  return context;
}
