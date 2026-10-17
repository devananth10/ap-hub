<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## AP Hub milestone workflow

The user wants this app backed up to GitHub at each logical milestone.

- Treat a milestone as a coherent, working improvement, rather than every individual edit.
- Before committing, review the diff and run checks appropriate to the change. For application changes, run `pnpm typecheck`, `pnpm build`, and the existing smoke checks against a running server. Stop any temporary verification server you start, but preserve the user's preview server.
- Commit the milestone with a descriptive message, then push the current branch to its configured GitHub upstream. This is the user's standing preference for work on this app; do not create a timed automation.
- Never commit credentials, local notes/browser storage, `.env` files, dependencies, or generated build output. Inspect newly added files before staging. Keep unrelated user changes out of a milestone commit.
- Use normal pushes. Never force-push, discard work, merge branches, or change repository visibility without explicit authorization.
- Use the `codex/` prefix for new feature branches. Do not create a new branch for routine milestone saves unless the task needs isolation or the user requests one.
- If authentication or access is unavailable, preserve the local work and report that the push is pending. Never claim GitHub is up to date until the remote commit is verified.
