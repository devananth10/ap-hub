# AP Hub

A local-first AP study prototype built with **Next.js App Router, TypeScript, React, and Tailwind CSS**. No authentication, billing, AI service, database, API key, or environment file is needed.

## Run locally

Install Node.js 20.9 or newer and pnpm 11.25 or newer. From this project directory:

```sh
pnpm install
pnpm dev
```

Open **http://127.0.0.1:3000**. Stop the server with Ctrl+C.

If PowerShell cannot find `pnpm`, install pnpm and open a new terminal so the executable is available on PATH.

The committed `pnpm-lock.yaml` pins the dependency tree. If you prefer npm, `npm install` and `npm run dev` also work, but use one package manager consistently.

## What works

- Dashboard with course selection, an empty state, and real completion/note counts. Chemistry, Biology, and Calculus AB are initially selected so the layout can be explored immediately.
- Six selectable AP course outlines. Chemistry, Biology, and Calculus include multiple units; the remaining subjects have one illustrative unit. These are prototype outlines, not complete course curricula.
- One complete study workspace: **AP Chemistry → Unit 1 → Topic 1.5 → Atomic structure and electron configuration**.
- Click-to-load YouTube privacy-enhanced embed, plus a direct source link when playback isn't permitted or a school network blocks YouTube. No video or third-party lesson content is downloaded or reproduced.
- Video iframe stays mounted while opening notes or the sample summary and switching between resources, overview, and practice. Resource links open in new tabs. Leaving the topic or reloading restarts the player; cross-page timestamp restoration isn't included.
- Optional notes, hidden initially, saved per topic in localStorage. A notes library lets you return to them. Course selection, bookmarks, completion, last topic, and theme also persist locally.
- Quick AI summary **placeholder** with an original sample topic recap. No AI API is connected, no transcript is fetched, and no video analysis is claimed.
- AP-style practice **placeholder** with one original unscored question and answer feedback. It is not an official AP question. No question bank or exam scoring is implemented.
- Light/dark themes, responsive navigation, keyboard-accessible dialogs, tab navigation, mobile menu focus management, invalid-route handling, and a warning when local saving fails.

## Verify the prototype

```sh
pnpm typecheck
pnpm build
pnpm start
```

Keep `pnpm start` running. In a second terminal:

```sh
pnpm test
```

The smoke suite checks 12 app routes, compiled CSS, and three 404 routes. It uses Node's built-in fetch/assert and needs no browser installation. To use a different server: `BASE_URL=http://127.0.0.1:3001 pnpm test` (PowerShell: `$env:BASE_URL='http://127.0.0.1:3001'; pnpm test`).

Browser interaction checklist:

1. Open **Manage courses**, toggle a subject, close the dialog, and reload. Check that the dashboard and sidebar agree. Remove all courses to check the empty state, then add one again.
2. Open Chemistry, expand/collapse a unit, and select Topic 1.5. Select a planned topic to confirm its honest coming-soon state. Search for a course or topic using the header search or Ctrl/Cmd+K.
3. Click the video play button. Open resources in another tab and return. Switch the lower tabs and open/close the summary and notes; the video iframe must remain in place.
4. Open notes, enter text, close/reopen the panel, reload, and verify the text remains. Visit **My notes** and follow **Continue writing**. Reloading normally leaves notes hidden; following a `#notes` link intentionally opens them.
5. Bookmark a resource, check **Saved resources**, reload, and unsave it.
6. Open the summary and verify its placeholder disclosure. Open Practice, choose an incorrect answer, check the explanation, retry, and choose the correct answer. Completion changes only when you explicitly mark a topic complete.
7. Switch themes and reload. Check dashboard and lesson at 1440, 768, 390, and 320 pixels wide: no horizontal scrolling, usable controls, and readable content. Test mobile navigation, Escape, Tab/Shift+Tab, and arrow keys in the study tabs.
8. In browser developer tools, block localStorage writes and type a note. Verify the save warning; keep/copy the note before closing the page. Do this in a disposable browser profile to protect your personal notes.

## Troubleshooting

- **Turbopack worker panic on Windows:** both dev and build scripts explicitly use Next.js's supported `--webpack` option. This avoids the worker failure observed in this environment.
- **Port 3000 is busy:** `pnpm dev --port 3001` or `pnpm start --port 3001`, then open the URL printed by Next.js. Set `BASE_URL` for smoke tests.
- **PowerShell cannot find pnpm:** install pnpm and reopen your terminal. This app doesn't require a globally installed Next.js CLI.
- **Dependency installation blocked:** allow access to the package registry and pnpm's package store. Restricted Windows environments may need permission to create package-store links.
- **Build output permissions or stale chunks:** stop all owned Next.js processes, then remove only this project's `.next` folder and rerun `pnpm build`. Don't run dev and a production build against the same `.next` output at once.
- **Video unavailable:** use the visible YouTube or original lesson link. Embedding, playback, advertisements, network access, and regional restrictions are controlled by the video provider. The local interface doesn't depend on successful playback.
- **Notes not surviving:** storage must be enabled for this origin. Private browsing, changing hostname/port, clearing site data, or switching devices/profiles changes or removes local data. A visible warning appears when saving fails. There is no cloud sync.

## Verification performed

Verified on October 17, 2026:

- TypeScript and the final Webpack production build passed.
- All 16 HTTP/CSS smoke checks passed against both development and production servers.
- Browser checks passed for course selection persistence and empty state, topic search and empty search, unit expansion/collapse, planned-topic messaging, bookmark persistence, notes save/reopen/reload and library links, explicit completion, dark-mode persistence, summary disclosure, and both correct/incorrect practice feedback.
- The actual embedded video played successfully and remained paused at its current position while switching study tools.
- Dashboard/course/workspace layouts were inspected between 320 and 1440 pixels. DOM width checks found no horizontal overflow at tested mobile/tablet sizes. Keyboard navigation between study tabs worked. No browser console errors or warnings were observed in the final production check.
- The localStorage-denial scenario is documented in the manual checklist but was not simulated during this browser run. Provider/network restrictions may still affect video playback on other devices.

Preview captures are saved in `artifacts/ap-hub-dashboard.jpg`, `artifacts/ap-hub-workspace.jpg`, and `artifacts/ap-hub-mobile.jpg`.

## Extend it

```text
src/app/                       App Router pages, layout, error and 404 views
src/components/study-provider  Local data and theme state
src/components/app-shell       Responsive navigation and global search
src/components/dashboard       Dashboard and reusable course cards
src/components/course-outline  Units and topics
src/components/study-workspace Video, optional notes, recap and practice preview
src/components/resource-card   Resource links and bookmarking
src/components/ui              Shared dialog, course icons and original SVG art
src/lib/courses.ts             Typed course/unit/topic catalog and resource metadata
src/lib/lessons.ts             Per-topic lesson content, recap, and original practice demo
tests/smoke.mjs                HTTP route and CSS smoke checks
```

Add courses, units, and topics to the typed catalog. Leave unimplemented topics without `ready: true`. To enable a new topic, add its typed `Lesson` to `src/lib/lessons.ts` under `courseId/topicId`, supplying video metadata, resource links, overview prompts, sample recap, and an original practice example; then mark that topic ready in the catalog. The existing workspace renders those fields. Keep provider state local until a later increment explicitly introduces accounts and a persistence service.

All interface artwork and practice/overview text are original. Third-party resources are linked and attributed: [Bozeman Science](https://www.bozemanscience.com/ap-chem-005-electron-configuration), [OpenStax](https://openstax.org/books/chemistry-2e/pages/6-4-electronic-structure-of-atoms-electron-configurations), and the [Royal Society of Chemistry](https://periodic-table.rsc.org/). AP is a trademark of College Board, which is not affiliated with this prototype.

## GitHub milestones

See [CONTRIBUTING.md](CONTRIBUTING.md) for authentication, milestone validation, commits, and pushes. The project instructions in `AGENTS.md` record the preference to push completed milestones during active development.
