/**
 * SVG generation utilities for GitHub Profile Card
 */

import { PRESS_START_2P_BASE64 } from "./fonts/press-start-2p";
import { VT323_BASE64 } from "./fonts/vt323";
import { SILKSCREEN_BASE64 } from "./fonts/silkscreen";

/**
 * Per-element font size multipliers
 */
export interface FontSizes {
	title: number; // Character name
	level: number; // LV display
	username: number; // @username
	bio: number; // Bio text
	statLabel: number; // REPOS, FOLLOWERS, etc.
	statValue: number; // Stat numbers
	barLabel: number; // HP, MP labels
}

/**
 * Font configuration for SVG embedding
 */
export interface FontConfig {
	name: string;
	base64: string;
	/** Per-element font size multipliers */
	sizes: FontSizes;
	/** Letter spacing adjustment in pixels */
	letterSpacing: number;
	/** True for pixel/bitmap fonts that don't scale smoothly */
	isPixelFont: boolean;
}

/**
 * Available fonts for card rendering
 * Each font has optimized per-element size multipliers
 */
export const FONTS: Record<string, FontConfig> = {
	"press-start-2p": {
		name: "Press Start 2P",
		base64: PRESS_START_2P_BASE64,
		sizes: {
			title: 0.7, // Name prominent but not too wide
			level: 0.6,
			username: 0.6,
			bio: 0.55,
			statLabel: 0.55,
			statValue: 0.65,
			barLabel: 0.6,
		},
		letterSpacing: 0,
		isPixelFont: true,
	},
	vt323: {
		name: "VT323",
		base64: VT323_BASE64,
		sizes: {
			title: 1.4,
			level: 1.3,
			username: 1.2,
			bio: 1.2,
			statLabel: 1.2,
			statValue: 1.3,
			barLabel: 1.2,
		},
		letterSpacing: 1,
		isPixelFont: false, // VT323 scales relatively smoothly
	},
	silkscreen: {
		name: "Silkscreen",
		base64: SILKSCREEN_BASE64,
		sizes: {
			title: 1,
			level: 1,
			username: 1,
			bio: 1,
			statLabel: 1,
			statValue: 1,
			barLabel: 1,
		},
		letterSpacing: 0,
		isPixelFont: true,
	},
};

/**
 * Default font key
 */
export const DEFAULT_FONT = "press-start-2p";

/**
 * Escape special characters for SVG text content
 * Prevents XSS attacks when embedding user-provided data
 */
export function escapeXml(text: string): string {
	return text
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

/**
 * Truncate text with ellipsis if too long
 */
export function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) {
		return text;
	}
	return text.slice(0, maxLength - 1) + "…";
}

/**
 * Format number with K/M suffix for large numbers
 */
export function formatNumber(num: number): string {
	if (num >= 1_000_000) {
		return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
	}
	if (num >= 1000) {
		return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
	}
	return num.toString();
}

/**
 * 8-bit color palette for retro RPG theme
 */
export const COLORS = {
	dark: {
		background: "#1a1a2e",
		border: "#4a4a6a",
		text: "#eaeaea",
		textSecondary: "#a0a0b0",
		accent: "#00d4aa",
		statBar: "#3a3a5a",
		statFill: "#00d4aa",
	},
	light: {
		background: "#f0f0f0",
		border: "#c0c0d0",
		text: "#2a2a3a",
		textSecondary: "#6a6a7a",
		accent: "#008866",
		statBar: "#d0d0e0",
		statFill: "#008866",
	},
} as const;

/**
 * Card dimensions (GitHub README optimized)
 */
export const CARD = {
	width: 495,
	height: 195,
	padding: 20,
	borderRadius: 8,
	borderWidth: 3,
} as const;

/**
 * Get font configuration by key
 */
export function getFontConfig(fontKey: string): FontConfig {
	return FONTS[fontKey] || FONTS[DEFAULT_FONT];
}

/**
 * Get font sizes with optional overrides
 */
export function getFontSizes(fontKey: string, overrides?: Partial<FontSizes>): FontSizes {
	const config = getFontConfig(fontKey);
	if (!overrides) return config.sizes;
	return { ...config.sizes, ...overrides };
}

export function createSvgWrapper(
	content: string,
	theme: "dark" | "light",
	fontKey: string = DEFAULT_FONT
): string {
	const colors = COLORS[theme];
	const font = getFontConfig(fontKey);
	const fontFamily = `'${font.name}', `;
	const letterSpacing = font.letterSpacing ? `letter-spacing: ${font.letterSpacing}px;` : "";
	const fontFace = `@font-face {
      font-family: '${font.name}';
      src: url(data:font/woff2;base64,${font.base64}) format('woff2');
      font-weight: normal;
      font-style: normal;
    }`;

	return `<svg xmlns="http://www.w3.org/2000/svg" width="${CARD.width}" height="${CARD.height}" viewBox="0 0 ${CARD.width} ${CARD.height}" role="img" aria-label="GitHub Profile Card">
  <title>GitHub Profile Card</title>
  <style>
    ${fontFace}
    .card-bg { fill: ${colors.background}; }
    .card-border { fill: none; stroke: ${colors.border}; stroke-width: ${CARD.borderWidth}; }
    .text-primary { fill: ${colors.text}; font-family: ${fontFamily}'Courier New', monospace; ${letterSpacing} }
    .text-secondary { fill: ${colors.textSecondary}; font-family: ${fontFamily}'Courier New', monospace; ${letterSpacing} }
    .text-accent { fill: ${colors.accent}; font-family: ${fontFamily}'Courier New', monospace; ${letterSpacing} }
    .stat-bar { fill: ${colors.statBar}; }
    .stat-fill { fill: ${colors.statFill}; }
  </style>
  <rect class="card-bg" x="0" y="0" width="${CARD.width}" height="${CARD.height}" rx="${CARD.borderRadius}"/>
  <rect class="card-border" x="${CARD.borderWidth / 2}" y="${CARD.borderWidth / 2}" width="${CARD.width - CARD.borderWidth}" height="${CARD.height - CARD.borderWidth}" rx="${CARD.borderRadius}"/>
  ${content}
</svg>`;
}

/**
 * Generate error SVG card
 */
export function createErrorSvg(
	message: string,
	theme: "dark" | "light" = "dark"
): string {
	const escapedMessage = escapeXml(message);

	const content = `
  <text x="${CARD.width / 2}" y="${CARD.height / 2 - 10}" text-anchor="middle" class="text-primary" font-size="16" font-weight="bold">ERROR</text>
  <text x="${CARD.width / 2}" y="${CARD.height / 2 + 15}" text-anchor="middle" class="text-secondary" font-size="12">${escapedMessage}</text>
  `;

	return createSvgWrapper(content, theme);
}
