/**
 * Retro RPG-style status screen template
 * Inspired by classic 8-bit JRPGs
 */

import type { GitHubUser, CardOptions } from "../types";
import { escapeXml, truncateText, formatNumber, createSvgWrapper, CARD, COLORS, DEFAULT_FONT, getFontSizes } from "../svg";

/**
 * Localized labels
 */
const LABELS = {
	en: {
		level: "LV",
		repos: "REPOS",
		followers: "FOLLOWERS",
		following: "FOLLOWING",
		hp: "HP",
		mp: "MP",
		exp: "EXP",
	},
	ja: {
		level: "LV",
		repos: "リポジトリ",
		followers: "フォロワー",
		following: "フォロー中",
		hp: "HP",
		mp: "MP",
		exp: "EXP",
	},
} as const;

/**
 * Calculate "level" based on repos and followers
 * Just for fun - RPG-style representation
 */
function calculateLevel(repos: number, followers: number): number {
	const score = repos * 2 + followers;
	if (score >= 10000) return 99;
	if (score >= 5000) return 80;
	if (score >= 2000) return 60;
	if (score >= 1000) return 50;
	if (score >= 500) return 40;
	if (score >= 200) return 30;
	if (score >= 100) return 20;
	if (score >= 50) return 15;
	if (score >= 20) return 10;
	if (score >= 10) return 5;
	return 1;
}

/**
 * Calculate HP/MP percentages for stat bars
 */
function calculateStats(user: GitHubUser): { hp: number; mp: number; exp: number } {
	// HP: Based on total activity (repos + followers + following)
	const total = user.public_repos + user.followers + user.following;
	const hp = Math.min(100, Math.floor((total / 500) * 100));

	// MP: Based on repos ratio
	const mp = Math.min(100, Math.floor((user.public_repos / 100) * 100));

	// EXP: Based on followers
	const exp = Math.min(100, Math.floor((user.followers / 1000) * 100));

	return { hp: Math.max(10, hp), mp: Math.max(10, mp), exp: Math.max(10, exp) };
}

/**
 * Generate RPG-style stat bar
 */
function createStatBar(
	x: number,
	y: number,
	label: string,
	value: number,
	_theme: "dark" | "light",
	fontSize: number = 10
): string {
	const barWidth = 120;
	const barHeight = 10;
	const fillWidth = (value / 100) * barWidth;

	return `
    <text x="${x}" y="${y}" class="text-secondary" font-size="${fontSize}">${label}</text>
    <rect x="${x + 25}" y="${y - 8}" width="${barWidth}" height="${barHeight}" rx="2" class="stat-bar"/>
    <rect x="${x + 25}" y="${y - 8}" width="${fillWidth}" height="${barHeight}" rx="2" class="stat-fill"/>
    <text x="${x + 150}" y="${y}" class="text-accent" font-size="${fontSize}">${value}%</text>
  `;
}

/**
 * Generate the main RPG-style card
 */
export function generateRpgCard(user: GitHubUser, options: CardOptions): string {
	const { theme, lang } = options;
	const fontKey = options.font || DEFAULT_FONT;
	const labels = LABELS[lang];
	const colors = COLORS[theme];
	const sz = getFontSizes(fontKey, options.sizeOverrides); // per-element size multipliers

	const level = calculateLevel(user.public_repos, user.followers);
	const stats = calculateStats(user);

	const displayName = escapeXml(truncateText(user.name || user.login, 20));
	const displayBio = user.bio ? escapeXml(truncateText(user.bio, 40)) : "";
	const displayLogin = escapeXml(user.login);

	// Font sizes adjusted by per-element multipliers
	// Base sizes: title=20, level=16, username=12, bio=11, statLabel=11, statValue=14, barLabel=10
	const fs = {
		title: Math.round(20 * sz.title),
		level: Math.round(16 * sz.level),
		username: Math.round(12 * sz.username),
		bio: Math.round(11 * sz.bio),
		statLabel: Math.round(11 * sz.statLabel),
		statValue: Math.round(14 * sz.statValue),
		barLabel: Math.round(10 * sz.barLabel),
	};

	const content = `
    <!-- Character Name & Level -->
    <text x="${CARD.padding}" y="35" class="text-accent" font-size="${fs.title}" font-weight="bold">${displayName}</text>
    <text x="${CARD.width - CARD.padding}" y="35" class="text-primary" font-size="${fs.level}" text-anchor="end">${labels.level} ${level}</text>

    <!-- Username -->
    <text x="${CARD.padding}" y="55" class="text-secondary" font-size="${fs.username}">@${displayLogin}</text>

    <!-- Bio -->
    ${displayBio ? `<text x="${CARD.padding}" y="75" class="text-secondary" font-size="${fs.bio}">${displayBio}</text>` : ""}

    <!-- Divider line -->
    <line x1="${CARD.padding}" y1="90" x2="${CARD.width - CARD.padding}" y2="90" stroke="${colors.border}" stroke-width="1" stroke-dasharray="4,2"/>

    <!-- Stats Section -->
    <g transform="translate(${CARD.padding}, 110)">
      <!-- Left column: Numbers -->
      <text x="0" y="0" class="text-secondary" font-size="${fs.statLabel}">${labels.repos}</text>
      <text x="0" y="15" class="text-accent" font-size="${fs.statValue}" font-weight="bold">${formatNumber(user.public_repos)}</text>

      <text x="70" y="0" class="text-secondary" font-size="${fs.statLabel}">${labels.followers}</text>
      <text x="70" y="15" class="text-accent" font-size="${fs.statValue}" font-weight="bold">${formatNumber(user.followers)}</text>

      <text x="150" y="0" class="text-secondary" font-size="${fs.statLabel}">${labels.following}</text>
      <text x="150" y="15" class="text-accent" font-size="${fs.statValue}" font-weight="bold">${formatNumber(user.following)}</text>
    </g>

    <!-- RPG Stat Bars -->
    <g transform="translate(${CARD.padding}, 155)">
      ${createStatBar(0, 0, labels.hp, stats.hp, theme, fs.barLabel)}
      ${createStatBar(0, 20, labels.mp, stats.mp, theme, fs.barLabel)}
    </g>

    <!-- Decorative corners (8-bit style) -->
    <rect x="5" y="5" width="8" height="2" fill="${colors.accent}"/>
    <rect x="5" y="5" width="2" height="8" fill="${colors.accent}"/>
    <rect x="${CARD.width - 13}" y="5" width="8" height="2" fill="${colors.accent}"/>
    <rect x="${CARD.width - 7}" y="5" width="2" height="8" fill="${colors.accent}"/>
    <rect x="5" y="${CARD.height - 7}" width="8" height="2" fill="${colors.accent}"/>
    <rect x="5" y="${CARD.height - 13}" width="2" height="8" fill="${colors.accent}"/>
    <rect x="${CARD.width - 13}" y="${CARD.height - 7}" width="8" height="2" fill="${colors.accent}"/>
    <rect x="${CARD.width - 7}" y="${CARD.height - 13}" width="2" height="8" fill="${colors.accent}"/>
  `;

	return createSvgWrapper(content, theme, fontKey);
}
