# github-profile-card-worker

## Overview

Cloudflare Worker that generates retro RPG-style SVG profile cards from GitHub user data (TypeScript, Hono). Served at `card.nullvariant.com/rpg/{username}`. Supports dark/light themes and English/Japanese.

## Key Constraints

1. Use the Hono framework for routing and middleware — do not replace with raw fetch handler.
2. XML-escape all user inputs (GitHub username, repo names, etc.) when embedding in SVG output (XSS prevention).
3. Maintain the WOFF2 base64 font embedding pattern — do not switch to external font loading.
4. Preserve the auth-free GitHub API design — assume 60 req/hour rate limit. Maintain cache/fallback accordingly.

## Development

```bash
pnpm install        # Install dependencies
pnpm dev            # Local development (Wrangler)
pnpm deploy         # Deploy to Cloudflare Workers
pnpm tail           # View live logs
```
