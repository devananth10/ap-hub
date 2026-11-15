# Original palette restoration — visual review

Status: restored locally for owner color approval; no Docker image built or pushed and no deployment performed.

Subsequent owner approval: the original palette in `2d7ff95` was approved. For release preparation, the sole authorized color adjustment is light-mode muted text `#657377` → `#657177` (two green-channel steps darker), improving its contrast on `#edf5f1` from 4.43:1 to 4.53:1. All other approved colors remain unchanged. The historical review and results below describe the original review checkpoint; release verification is recorded separately.

## Historical reference

The retained registry image `api.repoflow.io/prepatlas/prepatlas/studyhub-app@sha256:70e9e5fb81d92646a1b1649198e14e8c8fbdfd405e8cd730a821bd3d11793261` is recorded in `docs/DOCKER.md` at Git checkpoint `f622e3a`. Its compiled CSS was extracted without starting the application. Its base palette and relevant component colors match that checkpoint's `src/app/globals.css`, which remains unchanged in this restoration.

Read-only SSH inspection of the Pi was unavailable because authentication was unavailable. Therefore the archived image is verified, but its identity as the image attached to the saved `prepatlas-new` container is **not independently confirmed**. The owner's latest request did not include that container's full digest.

## Restored colors

| Role | Light | Dark |
| --- | --- | --- |
| Page | `#f7f8fa` | `#101b1d` |
| Sidebar, top bar, cards | `#ffffff` | `#192629` |
| Alternate surface | `#f5f7f7` | `#1e2d30` |
| Main text | `#243336` | `#e3eeeb` |
| Muted text | `#657377` | `#a2b3b3` |
| Borders | `#e6eaeb` | `#304044` |
| Green accent | `#267668` | `#87cbb6` |
| Selected navigation | `#edf5f1` | `#263f39` |
| Hero panels | `#174b43` | `#163e38` |

Original pastel course headers, cream hero button (`#e8edda`, text `#254c40`), hero text, video-poster colors, category badges and subtle original sidebar decoration are restored. Newer layout, typography, responsive rules, and the password-reset success component remain intact. Newer controls use existing palette values rather than a new palette.

## Visual comparisons

The local review gallery is served at `http://127.0.0.1:3102/`. Persistent artifacts are in `C:/Users/devan/.codex/visualizations/2026/10/17/01a14a50-98cd-74d2-a847-9845fa66437d/historical-palette-review/`.

Twelve screenshots compare the rejected charcoal palette against this restoration on homepage, account settings and Practice, in both light and dark mode. Each pair reuses the current page markup, fixed artwork, identical viewport (1280 × 960) and identical data. Account settings render the actual component with fictional read-only sample account data; these are visual fixtures, not a live authenticated-session test. No student data was read or changed to produce them.

Measured heading/panel/navigation bounds and typography are unchanged between each pair. Restored narrow layouts were inspected at 390 × 844 without horizontal overflow. Six additional side-by-side comparison screenshots are included in the artifact folder.

## Validation and known historical limitation

- `pnpm typecheck`: passed.
- `pnpm build`: passed (Next.js 16.4.2 production build).
- `pnpm test:unit`: **213 passed, 1 failed, 214 total**. The sole failure is the original light-mode muted text `#657377` on pale green `#edf5f1`: 4.43:1 against the test's 4.5:1 target. Exact original colors are retained for owner review. The threshold was not weakened or skipped. This restoration is not an all-green test checkpoint and should not be represented as contrast-compliant.
- Four password-reset UI tests: passed, including server acceptance before success, failure/retry, unavailable configuration, and unrelated password acknowledgment.
- `pnpm test:smoke`: passed against the isolated local server (20 page routes, CSS, seven invalid-route cases, seven fixed subject themes, fresh-home artwork randomization).
- `pnpm test:accounts:smoke`: passed against isolated local configuration, including account routes and safe callback failures. This is not hosted Supabase authentication verification.
- Exact historical core palette regression coverage added. Course-category contrast now tests the actual badge text color independently of decorative subject icon colors.

No authentication, Supabase, student data, content banks, deployment settings, or environment files are modified. Owner visual approval and a decision on the historical contrast limitation are needed before a new production image is prepared.
