# Run PrepAtlas with Docker

This packages the existing app as a Node 24 production server. It does not deploy anything publicly, run database migrations, import progress, or replace the existing development preview. Supabase stays hosted; there is no new PostgreSQL service.

## Prerequisite

Install/start [Docker Desktop for Windows](https://docs.docker.com/desktop/setup/install/windows-install/) with **Linux containers** and Docker Compose v2. Docker Desktop is now installed and the PrepAtlas Linux container is running on this computer.

Check `docker version` and `docker compose version` before continuing.

## Start a guest-only container

From the existing project folder:

```sh
docker compose up --build -d
docker compose ps
```

Open **http://127.0.0.1:3001/** on this computer. The container uses a separate port from the development preview on 3000; it does not start that development server. The base configuration accepts computer-only connections.

## Home-network preview

To add the specific Wi-Fi IPv4 address while retaining computer-only access, run in PowerShell:

```powershell
$env:PREPATLAS_LAN_IP = '192.168.86.28'
docker compose --env-file .env.local -f compose.yaml -f compose.lan.yaml up -d --no-build app
```

Then open **http://192.168.86.28:3001/** on another device connected to the same home network. The Wi-Fi address can change when reconnecting; update `PREPATLAS_LAN_IP` accordingly. Keep both `-f` arguments and the same address on subsequent LAN recreation commands. Add `--build` when updating application source. To return to computer-only access, run the base `docker compose --env-file .env.local up -d --no-build app` command.

This binds the requested Wi-Fi address rather than every network interface. No router port forwarding or public tunnel is needed or authorized. Windows Firewall may require an administrator-created inbound TCP 3001 rule limited to the local subnet; do not disable the firewall.

If another home device still cannot connect, open **PowerShell as administrator** and run this once (update the address if it changes):

```powershell
New-NetFirewallRule -Name 'PrepAtlas-Docker-LAN-3001' -DisplayName 'PrepAtlas Docker home-network preview (3001)' -Direction Inbound -Action Allow -Protocol TCP -LocalPort 3001 -LocalAddress 192.168.86.28 -RemoteAddress LocalSubnet -InterfaceAlias 'Wi-Fi' -Profile Any
```

This permits only local-subnet devices through Wi-Fi to that address/port, including when Windows labels the home Wi-Fi as Public. It does not change the network profile. Remove it later with `Remove-NetFirewallRule -Name 'PrepAtlas-Docker-LAN-3001'` in administrator PowerShell if no longer needed.

LAN HTTP is for guest study preview. Authenticated writes remain protected by the existing canonical-origin checks, and account actions from the LAN address are not supported by this change. Continue using the configured loopback origin for local account testing. Secure cross-device authentication requires a separately configured HTTPS origin and reviewed provider redirects; do not loosen those checks to enable HTTP sign-in.

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

- During initial packaging, native TypeScript, production build, all 230 unit/account tests, and development preview route/account smoke checks passed; the original preview was preserved at that time. At the later LAN diagnosis, no server was listening on 3000; the existing Docker container on 3001 was the running app.
- Compose YAML passed the official Compose Specification JSON schema, plus checks for persistent feedback, closed registration and public-only build arguments. The later optional LAN override adds one explicit Wi-Fi address while retaining loopback access. No actual environment values were displayed for this validation.
- The Node image tag and pinned pnpm package were confirmed available from their official registries.
- A separate allowlisted copy, with no environment files, generated Next standalone output on Windows. Its production server passed the route/CSS/artwork and production-mode account smoke suites; the sign-in form hydrated in the browser and correctly disabled unconfigured cloud controls. That temporary server/copy was stopped/removed afterwards.
- The owner subsequently installed Docker Desktop and built/started the Linux image. The existing container was observed healthy and served the home page with HTTP 200 before the LAN binding correction.
- After recreating only the existing app container with the LAN override, Docker reported healthy, running as `node`, with exactly loopback and `192.168.86.28` port-3001 bindings. Home, login, signup, account and progress returned HTTP 200 at both addresses from this computer. The route/CSS/artwork smoke suite passed at the LAN address. Account smoke passed at the canonical loopback origin; its redirect-origin assertion intentionally does not match the LAN guest address.
- Windows rejected creating the scoped firewall rule with **Access is denied**. The administrator command above remains owner-required if another home device cannot connect. A request from this computer to its own LAN address does not verify inbound firewall access from a second device.
- The LAN milestone passed TypeScript and a fresh native production build. The first restricted build encountered a Windows `EPERM` while creating generated output; the authorized retry completed successfully without changing application code or the running container.
- **Pending:** authenticated container flows and cross-device browser verification. Native standalone checks do not certify live authentication or two-device synchronization.

References: [Docker multi-stage builds](https://docs.docker.com/build/building/multi-stage/), [build context exclusions](https://docs.docker.com/build/concepts/context/), [Compose environment configuration](https://docs.docker.com/compose/how-tos/environment-variables/set-environment-variables/), [Next standalone output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output).
