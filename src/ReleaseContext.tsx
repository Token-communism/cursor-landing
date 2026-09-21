import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { detectVisitorPlatform, type VisitorPlatform } from "./platform";
import cursorFallback from "./cursor.fallback.json";
import { fetchLatestRelease, type ParsedRelease } from "./release";
import {
  fetchLatestCursor,
  parseCursorArchive,
  readCachedCursor,
  writeCachedCursor,
  type CursorRelease,
} from "./cursor";

/**
 * Cursor 精灵 release is only ever shown from a live GitHub fetch. There is no
 * build-time or cached copy: old assets are removed from GitHub, so stale
 * links would 404 for the visitor.
 */
export type ReleaseState =
  | { status: "loading" }
  | { status: "ready"; release: ParsedRelease }
  | { status: "failed" };

export interface ReleaseContextValue {
  release: ReleaseState;
  /** Re-run the GitHub fetch after a failure. */
  retryRelease: () => void;
  /** Official Cursor latest version from awesome-cursor-download. */
  cursor: CursorRelease | null;
  platform: VisitorPlatform;
}

const ReleaseContext = createContext<ReleaseContextValue | null>(null);

export function ReleaseProvider({ children }: { children: ReactNode }) {
  const [release, setRelease] = useState<ReleaseState>({ status: "loading" });
  const [cursor, setCursor] = useState<CursorRelease | null>(() =>
    parseCursorArchive(cursorFallback),
  );
  const [platform] = useState<VisitorPlatform>(() => detectVisitorPlatform());

  const loadRelease = useCallback(() => {
    setRelease({ status: "loading" });
    void fetchLatestRelease().then((fresh) => {
      setRelease(fresh ? { status: "ready", release: fresh } : { status: "failed" });
    });
  }, []);

  useEffect(() => {
    loadRelease();
  }, [loadRelease]);

  useEffect(() => {
    const cachedCursor = readCachedCursor(window.localStorage);
    if (cachedCursor) setCursor(cachedCursor);

    void fetchLatestCursor().then((fresh) => {
      if (!fresh) return;
      writeCachedCursor(window.localStorage, fresh);
      setCursor(fresh);
    });
  }, []);

  const value = useMemo(
    () => ({ release, retryRelease: loadRelease, cursor, platform }),
    [release, loadRelease, cursor, platform],
  );

  return (
    <ReleaseContext.Provider value={value}>{children}</ReleaseContext.Provider>
  );
}

export function useRelease(): ReleaseContextValue {
  const ctx = useContext(ReleaseContext);
  if (!ctx) {
    throw new Error("useRelease must be used within ReleaseProvider");
  }
  return ctx;
}
