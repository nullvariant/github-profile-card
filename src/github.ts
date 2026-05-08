import type { GitHubUser } from "./types";

const GITHUB_API_BASE = "https://api.github.com";

/**
 * GitHub username validation regex
 * - 1-39 characters
 * - Alphanumeric and hyphens only
 * - Cannot start or end with hyphen
 */
export const GITHUB_USERNAME_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$|^[a-zA-Z0-9]$/;

export type GitHubApiResult =
	| { success: true; user: GitHubUser }
	| { success: false; error: string; status: number };

/**
 * Fetch GitHub user public information
 * No authentication required - uses public API (60 requests/hour limit)
 */
export async function fetchGitHubUser(username: string): Promise<GitHubApiResult> {
	// Validate username format
	if (!GITHUB_USERNAME_REGEX.test(username)) {
		return {
			success: false,
			error: "Invalid username format",
			status: 400,
		};
	}

	try {
		const response = await fetch(`${GITHUB_API_BASE}/users/${username}`, {
			headers: {
				"Accept": "application/vnd.github.v3+json",
				"User-Agent": "github-profile-card-worker/1.0",
			},
		});

		if (!response.ok) {
			if (response.status === 404) {
				return {
					success: false,
					error: `User '${username}' not found`,
					status: 404,
				};
			}
			if (response.status === 403) {
				return {
					success: false,
					error: "GitHub API rate limit exceeded",
					status: 429,
				};
			}
			return {
				success: false,
				error: `GitHub API error: ${response.status}`,
				status: response.status,
			};
		}

		const data: GitHubUser = await response.json();

		return {
			success: true,
			user: {
				login: data.login,
				name: data.name,
				bio: data.bio,
				public_repos: data.public_repos,
				followers: data.followers,
				following: data.following,
				avatar_url: data.avatar_url,
				html_url: data.html_url,
				created_at: data.created_at,
			},
		};
	} catch (error) {
		const message = error instanceof Error ? error.message : "Failed to fetch GitHub user data";
		return {
			success: false,
			error: message,
			status: 500,
		};
	}
}
