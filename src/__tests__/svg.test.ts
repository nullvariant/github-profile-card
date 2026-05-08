import { describe, it, expect } from "vitest";
import { escapeXml, truncateText, formatNumber, getFontConfig, DEFAULT_FONT, FONTS } from "../svg";

describe("escapeXml", () => {
  it("escapes all XML special characters", () => {
    expect(escapeXml('a&b<c>d"e\'f')).toBe(
      "a&amp;b&lt;c&gt;d&quot;e&#39;f"
    );
  });

  it("returns empty string unchanged", () => {
    expect(escapeXml("")).toBe("");
  });

  it("returns plain text unchanged", () => {
    expect(escapeXml("hello world")).toBe("hello world");
  });
});

describe("truncateText", () => {
  it("returns short text unchanged", () => {
    expect(truncateText("short", 10)).toBe("short");
  });

  it("truncates long text with ellipsis", () => {
    expect(truncateText("a very long string", 10)).toBe("a very lo…");
  });

  it("returns exact-length text unchanged", () => {
    expect(truncateText("exactly10!", 10)).toBe("exactly10!");
  });
});

describe("formatNumber", () => {
  it("formats small numbers as-is", () => {
    expect(formatNumber(42)).toBe("42");
    expect(formatNumber(999)).toBe("999");
  });

  it("formats thousands with K suffix", () => {
    expect(formatNumber(1000)).toBe("1K");
    expect(formatNumber(1500)).toBe("1.5K");
    expect(formatNumber(12_345)).toBe("12.3K");
  });

  it("formats millions with M suffix", () => {
    expect(formatNumber(1_000_000)).toBe("1M");
    expect(formatNumber(2_500_000)).toBe("2.5M");
  });
});

describe("getFontConfig", () => {
  it("returns config for known font", () => {
    const config = getFontConfig("vt323");
    expect(config.name).toBe("VT323");
  });

  it("falls back to default font for unknown key", () => {
    const config = getFontConfig("nonexistent");
    expect(config).toBe(FONTS[DEFAULT_FONT]);
  });
});
