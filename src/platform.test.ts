import { describe, expect, it } from "vitest";
import { detectPlatform } from "./platform";

describe("detectPlatform", () => {
  it("returns macos from UA-CH, then from the UA string", () => {
    expect(detectPlatform("Mozilla/5.0", "macOS")).toBe("macos");
    expect(
      detectPlatform(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      ),
    ).toBe("macos");
  });

  it("returns windows from UA-CH, then from the UA string", () => {
    expect(detectPlatform("Mozilla/5.0", "Windows")).toBe("windows");
    expect(
      detectPlatform(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      ),
    ).toBe("windows");
  });

  it("returns unknown for Linux, mobile, and anything else", () => {
    expect(detectPlatform("Mozilla/5.0", "Linux")).toBe("unknown");
    expect(
      detectPlatform("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36"),
    ).toBe("unknown");
    expect(
      detectPlatform(
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
      ),
    ).toBe("unknown");
  });
});
