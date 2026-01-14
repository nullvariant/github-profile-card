export interface Env {
	// KV Namespace for caching GitHub API responses (optional)
	GITHUB_CACHE?: KVNamespace;
	// Service Binding for analytics
	ANALYTICS: Fetcher;
}

export interface GitHubUser {
	login: string;
	name: string | null;
	bio: string | null;
	public_repos: number;
	followers: number;
	following: number;
	avatar_url: string;
	html_url: string;
	created_at: string;
}

export interface CardOptions {
	theme: "dark" | "light";
	lang: "en" | "ja";
	font?: string;
	/** Optional size overrides (multipliers) */
	sizeOverrides?: {
		title?: number;
		level?: number;
		username?: number;
		bio?: number;
		statLabel?: number;
		statValue?: number;
		barLabel?: number;
	};
}
