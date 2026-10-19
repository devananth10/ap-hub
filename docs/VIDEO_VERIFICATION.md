# Initial Jeremy Krug collection — October 18, 2026

Owner authorization: post-publication master prompt Phase 3.1 explicitly permits one-time automatic approval/publication of the initial verified Jeremy Krug AP Chemistry directory collection. This supersedes earlier exact-URL manual approval only for the recorded collection. Ordinary approval policy resumes afterward. No other teacher, course, website or future import is approved.

- Source: [Jeremy Krug's official directory](https://jeremykrug.com/ap-chem-videos/), fetched again October 18.
- **103 directory entries; 102 unique YouTube IDs.** All 102 unique videos passed fresh public YouTube oEmbed metadata checks (HTTP 200), matching creator metadata and exact current directory label/URL checks.
- **102 approved and published videos; all 91 topics covered.** Shared-topic lessons use one catalog record and multiple topic IDs. Actual public titles and creator names are retained.
- **One pending directory alias, 9.8b:** it repeats 9.8a's `Sl5mJT0tvSE` URL/title. The verified video is published once as Part A. No distinct Part B is claimed, published or guessed. There are no other failed/pending unique video IDs in this audit.
- Evidence: `content-drafts/chemistry/research/KRUG_VERIFICATION.json`; exact one-time approval scope/URLs: `docs/INITIAL_KRUG_APPROVAL.json`. The earlier research manifest/review remains historical, with its original pending flags. It is not the publication registry.
- Verification level: current directory mapping plus public provider title/creator metadata. No complete-video viewing, transcript analysis, universal embedding permission or scientific review of each lecture is claimed. HTTP 200 metadata does not guarantee playback on every network/device.
- Browser spot checks: actual Topic 1.1 Parts A and B playback was observed, including advancing captions. Page fullscreen entry/exit worked on desktop; YouTube's native fullscreen entry and exit control worked at a 390px viewport without resetting playback. Escape sent through the in-app browser did not exit that provider fullscreen, so Escape is not reported as verified there. Native exit worked. Notes toggling left the same player source active. These are spot checks, not certification of all 102 playback environments or physical iOS/Android devices.

## Implementation boundaries

One click-to-load player is mounted at a time. Multipart tabs preserve source Part A/B/C/D ordering, support arrow/Home/End keys and previous/next controls. Single-video topics have no one-item tab bar. Selection changes do not autoplay; Play is explicit. Switching to a different video intentionally resets that player's playback. Notes, summaries, watched marking and practice tabs do not remount the currently selected player.

Native YouTube fullscreen is enabled with `fs=1`, iframe `allowFullScreen` and fullscreen permission. An accessible page fullscreen shortcut expands the existing stage using the browser Fullscreen API; rejection gives an honest fallback message and original link. Browser Escape/native exit behavior remains subject to platform support. See [YouTube's official parameters](https://developers.google.com/youtube/player_parameters). No videos are downloaded or rehosted.

Watched status uses the existing `ap-hub:v1` local data with an additive `watchedVideos` array. Legacy data without this field loads with an empty array; notes, bookmarks, selections, theme and topic completion retain their old keys. Each watched identity combines stable resource ID and actual case-sensitive video ID. Move/reorder/title changes retain applicable watched progress; replacement video content does not inherit it. Marking is manual and undoable, separate from topic completion and Practice scores.

Browser checks confirmed manual Mark/Undo, refresh and topic-navigation persistence, notes autosave/reload (temporary test text restored), single-video/no-tab behavior, four-part tab Home/End navigation and boundaries, correct Calculus empty states, and an integrated eleven-question quiz scoring 11/11 (100%) with restart. Responsive 390px and 768px checks had no horizontal overflow. Notes and player controls were usable in the narrow view. Existing captured application browser warnings/errors during these checks: none.

Every registered topic has the existing workspace shell and optional local notes. Chemistry topics now show approved videos and eleven MCQs; other courses show honest empty states. Only the pre-existing Topic 1.5 has its original detailed overview/summary; other topics show general study workflow and clearly state that topic-specific text/summary is not written. No lecture summary was fabricated.

Editing: [VIDEO_EDIT_GUIDE.md](../VIDEO_EDIT_GUIDE.md). No unsecured admin screen, paid AI, new question bank or public deployment was added.
