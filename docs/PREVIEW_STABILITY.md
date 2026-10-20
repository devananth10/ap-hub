# Local Preview investigation — October 18, 2026

The preview remains on **127.0.0.1:3000**. No student storage, question files or active build directories were deleted. No preview restart was used as a claimed fix.

## Evidence

- Historical logs contain `Manifest file is empty` for `/practice` and `Unexpected end of JSON input`. During this milestone the existing log also recorded a static-path-generation JSON parse warning while files were being edited. Routes subsequently recovered. A permanent root cause has **not** been established.
- Process inspection found one Next development launcher (PID 17652) and its expected server child (3528); only child 3528 listened on port 3000. These are one server tree, not two competing development servers. No competing Next development checkout was found in the process inspection.
- `next.config.ts` already isolates production `.next` from development `.next-preview`; this was preserved. Production builds and smoke tests use a separate port. No code in PrepAtlas writes Next's manifests.
- The installed Next implementation's `evalManifest` (`node_modules/next/dist/server/load-manifest.external.js`) synchronously reads a manifest and throws the exact empty-content error. Its development setup and manifest plugin contain direct asynchronous file writes. A read/write timing race is consistent with the symptom, but the log does not identify the writer/path responsible. OneDrive sync or a competing process is **not** a proven cause.
- A separate catalog-ID validation error occurred during live editing and was corrected before validation/checkpointing. It was caused by unsafe characters in provisional resource IDs, not evidence of the older manifest problem. Final IDs are stable `krug-chemistry-001`…`102` and resource tests pass.

## Safeguards and reproduction check

Keep one development server, keep production output separate, and never clear an active output directory. Finish JSON edits in one write or use a temporary sibling plus rename, and validate resources before requesting a checkpoint. Do not patch Next dependencies or suppress parse errors to make a test appear green.

`pnpm test:preview` makes eighty requests across eight representative routes at concurrency three with **no retries**. It also checks for new manifest parse errors appended to the known preview log during the run. It can run while a production build uses the isolated output. Passing this bounded check demonstrates current stability only; it cannot rule out a rare future development-time race.

If it recurs, preserve the log and the exact route/edit/build timing before restarting anything. Identify the manifest path and active writer, then seek a reproducible minimal case or verified upstream fix. Do not delete notes or alter the Chemistry bank to troubleshoot it. A production build is separately validated; the development warning is not a reason to claim permanent resolution.

## October 20 recurrence during Geography 4.5–4.6 verification

The standard smoke run reached `/practice?course=biology&unit=1&topic=electron-configuration` and received 500 instead of the expected 404. The preview stderr and development log recorded `SyntaxError: Unexpected end of JSON input`, with `/practice` as the page but no JSON filename or writer. The production build had its separate `.next` output; question authoring had finished before this smoke run. No source change to Practice routing caused a demonstrated deterministic failure.

The existing stderr was copied to ignored `tmp/preview-20261020-recurrence-stderr.log` before further checks. A read-only snapshot of all nine development JSON manifests parsed successfully and was saved in ignored `tmp/preview-20261020-manifest-snapshot.json`. These post-incident snapshots cannot establish which file was incomplete at the error time. Relevant Practice/bank/resource modules contain no explicit runtime JSON parsing call; Next's manifest loader does, but the trace is insufficient to identify that loader as the proven source.

With authoring paused and without restarting the preview, changing dependencies, clearing outputs or touching student storage, the entire standard route/invalid-route suite passed, followed by the 80-request, concurrency-three preview check with no retries or new parse errors. Recovery is verified; permanent resolution and a precise root cause remain unproven. The next reproduction should capture the actual failing JSON path and writer rather than infer OneDrive or production builds as the cause.
