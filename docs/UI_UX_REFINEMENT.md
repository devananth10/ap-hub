# PrepAtlas interface refinement

## Scope and audit

October 25, 2026. Baseline: `1ec7f91`, clean working tree. This milestone refines presentation; it does not change authentication, the database, synchronization, content, storage keys or scoring rules.

The existing dashboard, course outline, Practice and account forms were inspected in the browser, alongside the shared styles and notes/progress components. The highest-impact problems were:

1. Many supporting labels were 7-11px, with mobile rules shrinking them further. Important resource and topic information lacked a consistent reading scale.
2. Card radii, padding, borders, buttons and headings varied across features added at different milestones.
3. Dark mode reused pale course-art panels and several fixed light colors, weakening visual cohesion.
4. Large Practice scope artwork, repeated instructions and a tall setup area delayed the first question.
5. The sidebar gave Practice and the current page almost identical selected treatments. Account/progress breadcrumbs fell back to a repeated brand name.
6. Search, dialogs, notes, course rows and account controls needed a more consistent keyboard/touch treatment.

## Design direction

- Preserve the green identity, existing navigation, original line art and prominent Start Practice actions.
- Use the native system font stack, comfortable reading sizes, a restrained heading scale and shared space/radius tokens. No font downloads.
- Give light mode soft neutral-green surroundings and crisp surfaces; give dark mode deliberate green-black surfaces and subdued subject colors.
- Prefer spacing and typography over extra decoration. Keep all surfaces opaque, remove backdrop blur and use only brief hover/focus transitions.
- Use one presentation stylesheet, `src/app/design-system.css`, imported after the existing feature-layout stylesheet. It owns shared tokens and visual components, while established layouts, chart rendering and feature behavior stay in place.
- Make Practice setup compact, questions easier to scan, selected/graded answers explicit and navigation comfortable on phones.
- Preserve optional notes, expandable resources, video-player identity and all existing loading/error/disabled states.
- Respect reduced motion, visible keyboard focus, accessible text contrast and 44px primary touch controls.

## Verification

### Changes shipped

- Shared native-system typography, readable supporting text, space/radius tokens, consistent buttons, cards, form controls, dialogs, breadcrumbs and focus rings.
- Coordinated light and dark green palettes, including subject headers in dark mode. No external fonts, animation packages, new production dependencies or translucent/glass panels.
- A quieter homepage with decorative floating copy and a redundant instructional callout removed. Original rotating artwork, course choices, progress cards and Start Practice actions remain.
- Course/unit/topic rows use more comfortable spacing and reading sizes. Resource, video, optional notes and summary panels share the same visual treatment.
- Practice setup is shorter. Topic sessions initially collapse Course/Unit/Topic under the keyboard-accessible native Change focus disclosure; broader scopes keep it expanded. Filters and route behavior remain available.
- Larger question/answer text, comfortable answer targets, and explicit Correct/Incorrect/Your answer labels supplement color. Answer keys, retries, grading and final-score logic are unchanged.
- Notes, progress and account pages use the shared scale. Notes explain guest versus signed-in saving accurately; account/progress breadcrumbs identify their destination. Published search results no longer incorrectly say Coming soon.
- Primary controls retain 44px targets, focus is visible, and reduced-motion CSS disables transitions/animations. Future FRQ/mixed modes remain disabled and labeled Coming soon.

### Checks passed

- `pnpm typecheck` and the final `pnpm build`.
- `pnpm test:unit`: **213 passed**, including six palette-contrast checks and three DOM-backed Practice accessibility/interaction tests.
- `pnpm test:accounts`: **26 passed** (existing mocks/isolated SQL/hook regressions; no hosted account changes).
- Production route/CSS/artwork checks: 20 page routes, seven invalid routes, seven fixed subject themes and fresh-home artwork rotation.
- Production account-page/callback checks and all **240** topic pages: 172 Chemistry/Calculus workspaces plus 68 Human Geography topics and unit/course/instructor/Practice checks.
- Live development preview route and account-page checks. The development server keeps its configured `https://prepatlas.app` authentication origin; the smoke harness now accepts an explicit `EXPECTED_AUTH_ORIGIN` for this intentional difference. It still asserts the exact trusted origin, login error path, no-cache headers and absence of authorization codes/recovery hashes. Application authentication and configuration were not changed.
- Browser layout checks on home, courses, Practice, notes, progress, guest account and login at **320, 390, 768 and 1440px**; no horizontal page overflow in checked views. Both light/dark desktop and phone views were inspected.
- Guest-only browser checks confirmed note autosave/reload, watched and completed state/reload, summary toggling, persistent single video URL across notes/summary interactions, radio selection, explanations, Previous/Next, retry and first-score immutability, and completed history.
- Mobile menu/Escape, dialog search, focus disclosure/filters, geography Enlarge and keyboard zoom to 200% worked. Compiled reduced-motion rules were inspected: animation-name none, transition none, scroll-behavior auto.
- Protected content/configuration/authentication/synchronization/schema directories are unchanged. All 2,640 MCQs, 240 summaries and 319 approved videos/resources remain in their existing manifests/files.

Browser state-changing checks used synthetic guest work on the temporary `localhost:3101` origin. No real credentials, account records or existing guest notes were edited, cleared or imported. The temporary production server is stopped after verification; the development preview remains available on port 3000.

### Limits

This is not a complete WCAG certification, physical-device/screen-reader audit or live signed-in Supabase test. Contrast tests cover shared text, brand, error, course, input-boundary and focus palettes against [WCAG text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) and [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) thresholds. Reduced-motion rules were inspected, not tested by changing the owner's OS preferences. Authenticated-only account screens inherit shared styles; no live login was performed. Video embedding/playback/fullscreen remains subject to the provider and browser; verification confirmed a single iframe and unchanged video URL during notes/summary toggles, not uninterrupted playback or native fullscreen on every device.

No Docker registry image or public website was updated by this UI milestone. Rebuilding/updating the Pi is a separate action. No paid APIs or service configuration changes were introduced.
