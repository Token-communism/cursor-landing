import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { detectVisitorPlatform, type VisitorPlatform } from "./platform";
import fallbackJson from "./release.fallback.json";
import {
  fetchLatestRelease,
  parseRelease,
  readCachedRelease,
  writeCachedRelease,
  type ParsedRelease,
} from "./release";

export interface ReleaseContextValue {
  release: ParsedRelease | null;
  platform: VisitorPlatform;
}

const ReleaseContext = createContext<ReleaseContextValue | null>(null);

export function ReleaseProvider({ children }: { children: ReactNode }) {
  const [release, setRelease] = useState<ParsedRelease | null>(() =>
    parseRelease(fallbackJson),
  );
  const [platform] = useState<VisitorPlatform>(() => detectVisitorPlatform());

  useEffect(() => {
    const cached = readCachedRelease(window.localStorage);
    if (cached) setRelease(cached);

    void fetchLatestRelease().then((fresh) => {
      if (!fresh) return;
      writeCachedRelease(window.localStorage, fresh);
      setRelease(fresh);
    });
  }, []);

  const value = useMemo(
    () => ({ release, platform }),
    [release, platform],
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
