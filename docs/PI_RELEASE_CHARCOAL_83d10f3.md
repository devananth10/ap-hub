# PrepAtlas charcoal / blue-gray release

Application source commit `83d10f360668632bf19e8e2b5477690897e38c47`.

ARM64 image tag `api.repoflow.io/prepatlas/prepatlas/studyhub-app:2026-11-14-charcoal-83d10f3-arm64`.

Immutable image digest `sha256:9d7acc0d1cf82f88c49ee87f189b02a8b1a8b9e9ff3172a1fffbf8fcd323d8c5`.

## Prepare in PuTTY

Run these commands as `admin` on the Raspberry Pi. Docker and Python 3 must be available. The helper reads the existing `prepatlas-release-0a2bca1` container and creates a stopped release. It retains its published ports, Docker networks/aliases, runtime environment, restart policy, security options and mounted volumes, including `studyhub_feedback` at `/app/data`. The existing `/home/admin/.env.local` is supplied to Docker. Current container environment overrides are carried forward privately, including the current recovery signing secret.

The helper requires the current app origin to match the public HTTPS site and registration to be false. It stops preparation if either needs review. It never prints environment values. The old container remains available for rollback.

```bash
cd /home/admin
docker pull --platform linux/arm64 api.repoflow.io/prepatlas/prepatlas/studyhub-app@sha256:9d7acc0d1cf82f88c49ee87f189b02a8b1a8b9e9ff3172a1fffbf8fcd323d8c5
curl --fail --silent --show-error --location --output /home/admin/prepare-prepatlas-release.py https://raw.githubusercontent.com/devananth10/ap-hub/19e9f6f47e3b3be68d232004326195286f72fb57/scripts/prepare-pi-release.py
python3 /home/admin/prepare-prepatlas-release.py api.repoflow.io/prepatlas/prepatlas/studyhub-app@sha256:9d7acc0d1cf82f88c49ee87f189b02a8b1a8b9e9ff3172a1fffbf8fcd323d8c5 prepatlas-release-83d10f3 --current prepatlas-release-0a2bca1
docker inspect --format '{{.State.Status}}' prepatlas-release-83d10f3
```

Continue only after the pull and helper succeed and the last command reports `created`. A pre-existing release name causes preparation to stop so it cannot overwrite another container.

## Switch when ready

This block is the explicit production cutover. The two containers share the same host ports, so the current app must stop before the prepared app starts. The block checks Docker health for up to two minutes and restarts the old container if the new one cannot become healthy.

```bash
bash <<'BASH'
set -euo pipefail
old=prepatlas-release-0a2bca1
new=prepatlas-release-83d10f3
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

old = inspect('prepatlas-release-0a2bca1')
new = inspect('prepatlas-release-83d10f3')
ports = old['HostConfig']['PortBindings']
assert sum(len(items or []) for items in ports.values()) == 2, 'Expected both published ports'
assert new['HostConfig']['PortBindings'] == ports, 'Port mappings differ'
assert any(m.get('Name') == 'studyhub_feedback' and m['Destination'] == '/app/data' and m.get('RW') for m in new['Mounts']), 'Feedback volume differs'
old_env = dict(item.split('=', 1) for item in old['Config']['Env'])
new_env = dict(item.split('=', 1) for item in new['Config']['Env'])
assert all(new_env.get(key) == value for key, value in old_env.items()), 'Runtime environment differs'
assert new_env.get('APP_REGISTRATION_ENABLED') == 'false', 'Registration must remain disabled'
assert new['State']['Health']['Status'] == 'healthy', 'Release is not healthy'
assert not old['State']['Running'], 'Previous release should be stopped for rollback'
print('PASS both ports, feedback volume, preserved runtime environment, closed registration and healthy release')
PY
curl --fail --silent --show-error --output /dev/null --write-out 'Homepage HTTP %{http_code}\n' https://prepatlas.app/
curl --fail --silent --show-error --output /dev/null --write-out 'Recovery page HTTP %{http_code}\n' https://prepatlas.app/forgot-password
```

Open `https://prepatlas.app` and verify the charcoal background/sidebar/cards and restrained green accents. On `/forgot-password`, use an authorized test address to confirm the green mail icon and “Check your email!” success screen after acceptance. Confirm videos, Practice and progress load normally. Live reset-email delivery remains a separate owner-run check.

## Roll back if needed

```bash
docker stop --time 30 prepatlas-release-83d10f3
docker start prepatlas-release-0a2bca1
docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' prepatlas-release-0a2bca1
```

Both versions use the same persistent feedback volume. Keep the original container and its image until the new release has passed the live checks. No removal or prune command is required.

## Verification

- The ARM64 Docker production build completed successfully, including compilation, TypeScript and static page generation. Its image revision label matches application source commit `83d10f3`. The build used only the two existing public Supabase build arguments and the existing allowlisted Docker context.
- The exact image ran locally under ARM64 emulation as a non-root user, without external network access, published host ports, server secrets or production data volumes. It became healthy. Eight application routes, cloud configuration recognition, closed registration, public callback origins and the reset-request origin check passed. Compiled CSS contained the charcoal tokens and excluded the superseded green page/card surface tokens. The compiled reset-success heading, explanatory text and styling were present.
- The source palette milestone had already passed the 213-test regression suite, contrast tests, password-reset UI tests, route/account smoke checks, TypeScript and the native production build.
- Five isolated helper tests passed, including selecting `prepatlas-release-0a2bca1` explicitly and preserving both port mappings. The exact runbook cutover block passed simulated healthy startup and unhealthy startup rollback. The read-only verification block passed a simulated preserved deployment and rejected altered ports, without printing environment values.
- The versioned registry push succeeded. Independent registry inspection confirmed the immutable digest above and one Linux ARM64 runtime manifest, plus a provenance attestation. Pulling that exact digest for ARM64 succeeded.
- The local test container was removed. Production deployment and live email checks remain owner-run steps. No Pi container, student data, Supabase/Resend configuration or Cloudflare setting was changed during release preparation.
