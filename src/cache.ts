/**
 * Cloudflare KV cache utilities for GitHub API responses
 */

import type { GitHubUser } from "./types";

const CACHE_TTL = 300; // 5 minutes in seconds
const CACHE_KEY_PREFIX = "github:user:";

/**
 * Get cached GitHub user data
 */
export async function getCachedUser(
	kv: KVNamespace | undefined,
	username: string
): Promise<GitHubUser | null> {
	if (!kv) return null;

	try {
		const key = `${CACHE_KEY_PREFIX}${username.toLowerCase()}`;
		const cached = await kv.get(key, "json");
		return cached as GitHubUser | null;
	} catch {
		return null;
	}
}

/**
 * Store GitHub user data in cache
 */
export async function setCachedUser(
	kv: KVNamespace | undefined,
	username: string,
	user: GitHubUser
): Promise<void> {
	if (!kv) return;

	try {
		const key = `${CACHE_KEY_PREFIX}${username.toLowerCase()}`;
		await kv.put(key, JSON.stringify(user), {
			expirationTtl: CACHE_TTL,
		});
	} catch {
		// Silently fail - caching is optional
	}
}
