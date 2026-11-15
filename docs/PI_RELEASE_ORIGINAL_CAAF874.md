# PrepAtlas approved original-palette release

Application source commit `caaf87494217057617805bad2d0b9308395a362b`.

ARM64 image tag `api.repoflow.io/prepatlas/prepatlas/studyhub-app:2026-11-14-original-caaf874-arm64`.

Immutable image digest `sha256:294f2395da20cfaa3fe920c8e24dbd30156086bc779f52f207f7bb7b218c7926`.

The owner-approved palette is from `2d7ff95`. The only subsequent color adjustment is light muted text `#657377` → `#657177`, raising contrast on pale green from 4.43:1 to 4.53:1. Blue-gray surfaces, green heroes, cream buttons, pastel course headers and the password-reset success screen are preserved. **This runbook has not been executed against production.**

## Prepare in PuTTY

Run these commands as `admin` on the Raspberry Pi. Docker and Python 3 must be available. The helper reads the existing `prepatlas-release-83d10f3` container and creates a stopped release. It retains its published ports, Docker networks/aliases, runtime environment, restart policy, security options and mounted volumes, including `studyhub_feedback` at `/app/data`. The existing `/home/admin/.env.local` is supplied to Docker. Current container environment overrides are carried forward privately, including the current recovery signing secret.

The helper requires the current app origin to match the public HTTPS site and registration to be false. It stops preparation if either needs review. It never prints environment values. The old container remains available for rollback.

```bash
bash <<'PREP'
set -euo pipefail
cd /home/admin
docker pull --platform linux/arm64 api.repoflow.io/prepatlas/prepatlas/studyhub-app@sha256:294f2395da20cfaa3fe920c8e24dbd30156086bc779f52f207f7bb7b218c7926
curl --fail --silent --show-error --location --output /home/admin/prepare-prepatlas-release.py https://raw.githubusercontent.com/devananth10/ap-hub/19e9f6f47e3b3be68d232004326195286f72fb57/scripts/prepare-pi-release.py
printf '%s  %s\n' '190cbd8b33ff9c837cc5b59521680f0f75c95732098bee538395c58c959f1e1f' '/home/admin/prepare-prepatlas-release.py' | sha256sum --check -
python3 /home/admin/prepare-prepatlas-release.py api.repoflow.io/prepatlas/prepatlas/studyhub-app@sha256:294f2395da20cfaa3fe920c8e24dbd30156086bc779f52f207f7bb7b218c7926 prepatlas-release-caaf874 --current prepatlas-release-83d10f3
docker inspect --format '{{.State.Status}}' prepatlas-release-caaf874
PREP
```

Continue only after the pull and helper succeed and the last command reports `created`. A pre-existing release name causes preparation to stop so it cannot overwrite another container.

## Switch when ready

This block is the explicit production cutover. The two containers share the same host ports, so the current app must stop before the prepared app starts. The block checks Docker health for up to two minutes and restarts the old container if the new one cannot become healthy.

```bash
bash <<'BASH'
set -euo pipefail
old=prepatlas-release-83d10f3
new=prepatlas-release-caaf874
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

## Verify the deployed release

After Docker reports healthy, run this read-only check. It compares both published port mappings and the private runtime configuration in memory, printing only the pass result.

```bash
python3 - <<'PY'
import json
import subprocess

def inspect(name):
    return json.loads(subprocess.check_output(['docker', 'inspect', name], text=True))[0]

old = inspect('prepatlas-release-83d10f3')
new = inspect('prepatlas-release-caaf874')
ports = old['HostConfig']['PortBindings']
assert sum(len(items or []) for items in ports.values()) == 2, 'Expected both published ports'
assert new['HostConfig']['PortBindings'] == ports, 'Port mappings differ'
assert any(m.get('Name') == 'studyhub_feedback' and m['Destination'] == '/app/data' and m.get('RW') for m in new['Mounts']), 'Feedback volume differs'
old_env = dict(item.split('=', 1) for item in old['Config']['Env'])
new_env = dict(item.split('=', 1) for item in new['Config']['Env'])
assert all(new_env.get(key) == value for key, value in old_env.items()), 'Runtime environment differs'
assert new_env.get('APP_REGISTRATION_ENABLED') == 'false', 'Registration must remain disabled'
assert new['Config']['Image'] == 'api.repoflow.io/prepatlas/prepatlas/studyhub-app@sha256:294f2395da20cfaa3fe920c8e24dbd30156086bc779f52f207f7bb7b218c7926', 'Release image differs'
assert new['State']['Health']['Status'] == 'healthy', 'Release is not healthy'
assert not old['State']['Running'], 'Previous release should be stopped for rollback'
print('PASS both ports, feedback volume, preserved runtime environment, closed registration and healthy release')
PY
curl --fail --silent --show-error --output /dev/null --write-out 'Homepage HTTP %{http_code}\n' https://prepatlas.app/
curl --fail --silent --show-error --output /dev/null --write-out 'Recovery page HTTP %{http_code}\n' https://prepatlas.app/forgot-password
```

Open `https://prepatlas.app` and verify the approved blue-gray backgrounds, green hero panels, cream buttons and pastel course headers in both light and dark modes. On `/forgot-password`, use an authorized test address to confirm the green mail icon and “Check your email!” success screen after acceptance. Confirm videos, Practice and progress load normally. Live reset-email delivery remains a separate owner-run check.

## Roll back if needed

```bash
docker stop --time 30 prepatlas-release-caaf874
docker start prepatlas-release-83d10f3
docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' prepatlas-release-83d10f3
```

Both versions use the same persistent feedback volume. Keep the original container and its image until the new release has passed the live checks. No removal or prune command is required.

## Verification

- All **214 unit/regression tests** and **35 account/recovery tests** passed, including all four password-reset UI tests. All contrast checks now pass without weakening thresholds. TypeScript passed. The native production build passed on retry after an initial Windows generated-directory permission error.
- Native and ARM64-image read-only route/CSS/artwork and account smoke suites passed. All 172 Chemistry/Calculus Study Workspaces, all 68 Human Geography topic pages and their scoped Practice routes, plus Chemistry course/unit/topic publication routes passed against the exact image. No existing student data was used as test data.
- Content checks confirmed all 2,640 published MCQs and 240 published summaries. Calculus structural/mathematical checks and the complete Geography audit passed. The source content, auth code, database, providers and production configuration are unchanged.
- Linux ARM64 production build passed using the existing Dockerfile, allowlisted context and only the existing two public Supabase build arguments. Image revision label: `caaf87494217057617805bad2d0b9308395a362b`.
- The exact image ran healthy under Docker Desktop ARM64 emulation as non-root `node`, with no external network access, published ports, production volumes or runtime secrets. Configuration recognition, closed registration, public callback destinations, reset-origin rejection, compiled original colors, contrast correction and the compiled “Check your email!” UI were verified. This was not a live sign-in, reset-email delivery or cross-device sync test.
- All five deployment-helper unit tests passed. The pinned helper was downloaded and its SHA-256 matched the tested source. The exact cutover commands passed simulated healthy startup and unhealthy startup rollback. The read-only verification commands passed a preserved-deployment fixture and rejected changed ports and an incorrect image, without printing private values.
- The unique RepoFlow tag was pushed successfully. Independent registry inspection confirmed OCI index digest `sha256:294f2395da20cfaa3fe920c8e24dbd30156086bc779f52f207f7bb7b218c7926`, one `linux/arm64` runtime manifest (`sha256:77910d68d3a5319bbe40340678930bb33f85781fb27dc03db8013e992953018f`) and provenance attestation. Pulling by the index digest succeeded and matched the tested local image identity.
- Temporary native verification server and image-test container were stopped/removed after testing; the user's palette review gallery was preserved. No Pi commands were executed, no production container was stopped/replaced, and no live data or provider settings were changed. Pi cutover, public-site verification and live reset-email delivery remain owner-run steps.
- Existing containers/images and `studyhub_feedback` must be retained. Do not run removal, volume-prune or destructive Compose commands as part of this update.
