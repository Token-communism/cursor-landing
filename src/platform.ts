export type VisitorPlatform = "macos" | "windows" | "unknown";

export function detectPlatform(
  userAgent: string,
  uaDataPlatform?: string | null,
): VisitorPlatform {
  const hints = uaDataPlatform?.trim();
  if (hints) {
    const platform = hints.toLowerCase();
    if (platform === "macos" || platform.includes("mac")) return "macos";
    if (platform === "windows" || platform.includes("win")) return "windows";
    return "unknown";
  }

  const ua = userAgent.toLowerCase();
  if (/iphone|ipad|ipod|android/.test(ua)) return "unknown";
  if (ua.includes("windows")) return "windows";
  if (ua.includes("macintosh") || ua.includes("mac os")) return "macos";
  return "unknown";
}

export function detectVisitorPlatform(
  nav: Pick<Navigator, "userAgent"> & {
    userAgentData?: { platform?: string };
  } = navigator,
): VisitorPlatform {
  return detectPlatform(nav.userAgent, nav.userAgentData?.platform);
}
