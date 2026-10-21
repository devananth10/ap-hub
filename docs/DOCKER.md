# Run PrepAtlas with Docker

This packages the existing app as a Node 24 production server. It does not deploy anything publicly, run database migrations, import progress, or replace the existing development preview. Supabase stays hosted; there is no new PostgreSQL service.

## Prerequisite

Install/start [Docker Desktop for Windows](https://docs.docker.com/desktop/setup/install/windows-install/) with **Linux containers** and Docker Compose v2. Docker Desktop/WSL were not installed on this computer during implementation. Their installation may require Windows administrator access and a restart. No installer or Windows features were changed automatically.

Check `docker version` and `docker compose version` before continuing.

## Start a guest-only container

From the existing project folder:

```sh
docker compose up --build -d
docker compose ps
```

Open **http://127.0.0.1:3001/**. The existing development preview remains at port 3000. Compose binds only to this computer's loopback address. No router/firewall changes or public tunnel are required.

Without Supabase variables the normal guest experience remains available. Next.js loads no local environment files into the image. Compose does not automatically read `.env.local`.

## Use the configured Supabase project

Use the existing ignored `.env.local` to supply Compose configuration:

```sh
docker compose --env-file .env.local up --build -d
```

Only the two public Supabase variables are build arguments. Next.js embeds `NEXT_PUBLIC_*` variables in browser code, so rebuilding is required when changing projects. Never substitute a secret/service-role key for the publishable key. See [Next.js environment variables](https://nextjs.org/docs/app/guides/environment-variables).

`AUTH_FLOW_SECRET` and optional `SUPABASE_SECRET_KEY` are injected at container startup, never copied into the image or supplied as build arguments. Runtime environments can still be inspected by a Docker administrator: do not share expanded `docker compose config`, container inspection output, screenshots of configuration, or environment files. For a future hosted deployment, review a managed/file-backed secret mechanism separately.

The container's `APP_ORIGIN` is explicitly set to `http://127.0.0.1:3001`, matching the address above instead of the development origin in `.env.local`. To use another local port, set `PREPATLAS_DOCKER_PORT` in your shell (for example, `$env:PREPATLAS_DOCKER_PORT = '3100'` in PowerShell); the browser origin and published port change together. Avoid reserved/occupied ports.

**Registration remains disabled by Compose.** Existing email/password accounts may sign in after configuration. OAuth and email recovery for this new origin require separately reviewed exact Supabase callback/redirect URLs before testing; this task does not alter provider settings. The current Google-registration gate is retained. Use a separate browser profile for initial container testing: cookies can be shared across ports on the same hostname.

## Persistent data

- Cloud notes, selections, watched state, completion, bookmarks and finished scores stay in the existing Supabase account.
- Guest storage belongs to the browser's exact origin. Port 3001 does not automatically inherit guest data from port 3000. Nothing is deleted or automatically imported; use the original address/profile to access existing guest work.
- The named `feedback` volume holds `/app/data/feedback.sqlite` and its WAL files for reviews/question reports. It survives container rebuilds/recreation. It is separate from the existing Windows feedback database, which is not copied or modified automatically.
- `docker compose down` removes containers/network while retaining this volume. **Do not use `down --volumes` or `docker volume prune` on data you need.** Back up feedback using SQLite's backup mechanism or while the container is stopped; do not copy a live SQLite file without its transaction state.

For a guest-only run, stop with `docker compose stop` and start again with `docker compose up -d`. For a configured run, keep the same prefix on subsequent commands: `docker compose --env-file .env.local stop`, `docker compose --env-file .env.local up -d`, and `docker compose --env-file .env.local up --build -d` after source changes. Omitting the environment file can recreate the container without its server secrets. This is a production container, so source edits require a rebuild; ordinary live editing still uses `pnpm dev`/`pnpm dev:lan`.

## Verification

After Docker is installed, verify:

1. `docker compose --env-file .env.local config --quiet` (validates without displaying secrets).
2. `docker compose --env-file .env.local up --build -d` and `docker compose ps` (healthy).
3. Home, topic/video tabs, summaries, notes and Practice load with CSS at port 3001. With a disposable account, check refresh/sync and the existing account acceptance checklist. Do not import or edit the owner's saved progress as a smoke test.
4. Run the existing smoke suites against the container from PowerShell:

   ```powershell
   $env:BASE_URL = 'http://127.0.0.1:3001'
   $env:PREPATLAS_SMOKE_PRODUCTION = '1'
   pnpm test:smoke
   pnpm test:accounts:smoke
   Remove-Item Env:BASE_URL
   Remove-Item Env:PREPATLAS_SMOKE_PRODUCTION
   ```

5. Verify the sign-in/recovery forms finish loading in the browser. Production HTTP smoke accepts their existing prerendered Suspense shells; that alone does not prove browser hydration or live authentication.
6. On disposable feedback data, confirm reports/reviews persist across `docker compose down` followed by `up -d`, and the app runs as user `node`. Do not delete the volume during this check.

The multi-stage Dockerfile uses the lockfile and pinned pnpm version, Next standalone output, a non-root runtime, a health check and graceful Node shutdown. `.dockerignore` allowlists source/build inputs and excludes local secrets/data even if placed under `src` or `public`. Do not push an image to a registry or publish the port publicly without separate authorization.

## Verification recorded October 21, 2026

- Native TypeScript, production build, all 230 unit/account tests, and development preview route/account smoke checks passed; the original preview remains running.
- Compose YAML passed the official Compose Specification JSON schema, plus checks for local-only binding, persistent feedback, closed registration and public-only build arguments. No actual environment values were expanded for this validation.
- The Node image tag and pinned pnpm package were confirmed available from their official registries.
- A separate allowlisted copy, with no environment files, generated Next standalone output on Windows. Its production server passed the route/CSS/artwork and production-mode account smoke suites; the sign-in form hydrated in the browser and correctly disabled unconfigured cloud controls. That temporary server/copy was stopped/removed afterwards.
- **Pending:** actual Docker/Linux image build/run, container health/non-root/volume persistence and authenticated container flows. Docker Desktop and WSL were unavailable. Native standalone checks are not a claim that these Docker checks passed.

References: [Docker multi-stage builds](https://docs.docker.com/build/building/multi-stage/), [build context exclusions](https://docs.docker.com/build/concepts/context/), [Compose environment configuration](https://docs.docker.com/compose/how-tos/environment-variables/set-environment-variables/), [Next standalone output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output).
