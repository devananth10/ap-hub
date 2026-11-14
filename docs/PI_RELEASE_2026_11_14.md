# PrepAtlas password-reset UI release

Application source commit `0a2bca14471e62ebedcf392e01879bea67437696`.

ARM64 image tag `api.repoflow.io/prepatlas/prepatlas/studyhub-app:2026-11-14-reset-ui-0a2bca1-arm64`.

Immutable image digest `sha256:1e61f21d919e9031eae74021f00864ec858ce4d3ab63c550f53850efaef6b8c4`.

## Prepare in PuTTY

Run these commands as `admin` on the Raspberry Pi. Docker and Python 3 must be available. The helper reads the existing `prepatlas-new` container and creates a stopped release. It retains its published ports, Docker networks/aliases, runtime environment, restart policy, security options and mounted volumes, including `studyhub_feedback` at `/app/data`. The existing `/home/admin/.env.local` is supplied to Docker. Current container environment overrides are carried forward privately, including the current recovery signing secret.

The helper requires the current app origin to match the public HTTPS site and registration to be false. It stops preparation if either needs review. It never prints environment values. The old container remains available for rollback.

```bash
cd /home/admin
docker pull api.repoflow.io/prepatlas/prepatlas/studyhub-app@sha256:1e61f21d919e9031eae74021f00864ec858ce4d3ab63c550f53850efaef6b8c4
curl --fail --silent --show-error --location --output /home/admin/prepare-prepatlas-release.py https://raw.githubusercontent.com/devananth10/ap-hub/57b9a4aa3434162fdce01e676afecdbfa533d348/scripts/prepare-pi-release.py
python3 /home/admin/prepare-prepatlas-release.py api.repoflow.io/prepatlas/prepatlas/studyhub-app@sha256:1e61f21d919e9031eae74021f00864ec858ce4d3ab63c550f53850efaef6b8c4 prepatlas-release-0a2bca1
docker inspect --format '{{.State.Status}}' prepatlas-release-0a2bca1
```

Continue only after the pull and helper succeed and the last command reports `created`. A pre-existing release name causes preparation to stop so it cannot overwrite another container.

## Switch when ready

This block is the explicit production cutover. The two containers share the same host ports, so the current app must stop before the prepared app starts. The block checks Docker health for up to two minutes and restarts the old container if the new one cannot become healthy.

```bash
bash <<'BASH'
set -euo pipefail
old=prepatlas-new
new=prepatlas-release-0a2bca1
test "$(docker inspect --format '{{.State.Running}}' "$old")" = true
test "$(docker inspect --format '{{.State.Status}}' "$new")" = created
docker stop --time 30 "$old"
restore_old() {
  docker stop --time 30 "$new" >/dev/null 2>&1 || true
  docker start "$old"
}
if ! docker start "$new"; then
  restore_old
  exit 1
fi
for attempt in $(seq 1 60); do
  health=$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}unknown{{end}}' "$new") || break
  if [ "$health" = healthy ]; then
    printf 'New release is healthy. Original container is retained for rollback.\n'
    exit 0
  fi
  if [ "$health" = unhealthy ]; then
    break
  fi
  sleep 2
done
printf 'New release did not become healthy. Restoring the original container.\n'
restore_old
exit 1
BASH
```

Open `https://prepatlas.app/forgot-password`. With an authorized test address, request a reset and confirm the new success screen appears only after acceptance. Confirm `/login`, `/progress`, videos and Practice load normally. A healthy container verifies its homepage response. An actual email request and receipt provide the remaining end-to-end recovery check.

## Roll back if needed

```bash
docker stop --time 30 prepatlas-release-0a2bca1
docker start prepatlas-new
docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' prepatlas-new
```

Both versions use the same persistent feedback volume. Keep the original container and its image until the new release has passed the live checks. No removal or prune command is required.

## Verification

- The password-reset source milestone passed TypeScript, the production build, all 35 account tests and the route/account smoke suites before packaging.
- The Docker Linux ARM64 production build completed, including TypeScript and static page generation. Compose loaded only the two public Supabase build arguments. The existing Docker build-context allowlist excluded private environment files and unrelated local files.
- The actual image ran under ARM64 emulation on Windows as a non-root user in an isolated container with no network, host ports, server secrets or production volumes. Eight routes returned HTTP 200. Cloud configuration recognition, closed registration, the public callback destinations, origin rejection, and the compiled success text/CSS passed. The temporary container was removed.
- Four isolated preparation-helper tests passed, covering preserved environment/ports/security/volume identity, IPv6 and network aliases, unsafe preflight rejection, and refusal to replace an existing release. The exact cutover block passed Bash syntax and simulated healthy-start/unhealthy-start rollback tests.
- The first registry upload timed out while finalizing a layer. A retry reused the accepted layers and succeeded. Registry inspection confirmed the immutable digest above and exactly one Linux ARM64 runtime manifest, plus its provenance attestation. Pulling the image by that digest succeeded.
- Pi SSH authentication was unavailable from this workstation. The Pi's environment, volume, current containers and Cloudflare/Supabase settings were not modified. Live Pi startup and reset-email delivery remain owner-run checks after cutover.
