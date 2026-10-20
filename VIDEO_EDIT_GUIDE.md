# Editing PrepAtlas video lessons

The single official catalog is **`src/config/official-resources.json`**. No public editing screen exists. Ordinary students cannot change this file. The initial Jeremy Krug collection was explicitly approved once by the owner on October 18, 2026; this does not approve future imports. Exact approved URLs and the unresolved 9.8b alias are recorded in `docs/INITIAL_KRUG_APPROVAL.json`.

## Find the lesson

Use `CONTENT_IMPORT_GUIDE.md` to look up the stable topic ID. Search the catalog for that ID, then its `part` (A/B/C/D) or actual title. For example Topic 3.4 uses `topic-3-4`; Part B is the record with that topic ID and `"part": "B"`. Every video has a permanent `id`, such as `krug-chemistry-025`. IDs are identities, not display positions: never renumber them to reorder the list.

Each entry stores title, publisher/creator, exact YouTube URL, extracted `video.videoId`, course/unit/topic IDs, optional part, integer order, visibility, owner approval and source verification. Topic IDs in one entry may include several topics in the same unit. A shared video has one record; do not duplicate its YouTube ID. Cross-unit reuse would need an explicit association-schema extension; the initial collection does not require it.

## Correct or replace

- **Title or creator:** correct `title` or `publisher` after checking the source. Keep the resource ID and video ID; notes and watched state remain intact.
- **Move within a unit:** change `topicIds`. To move to another unit, update `unitNumber` and use IDs from that unit. Keep the resource ID and actual video ID. Topic notes remain under their original topic keys; moving a video does not move or erase notes.
- **Reorder:** change `order` to the desired nonnegative integer. Lower values appear first. Distinct order values avoid ambiguous ties. This also orders resource cards. Do not change resource IDs, part designations or URLs just to reorder.
- **Hide:** set `visibility` to `hidden`. **Restore:** set it to `published`. Approval and local progress remain intact, but hidden entries are never passed to student pages. Changing visibility cannot approve a draft.
- **Remove:** delete the record when the owner requests removal. Historical local saved/watched IDs are retained, without displaying a removed link.
- **Replace URL:** obtain explicit approval of the replacement URL (the owner's instruction “replace ... with this link” supplies that authorization). Update `url`, `video.videoId`, title/creator/source as needed, and `approval.approvedUrl`, date and reference to that instruction. Until approved, use `approval: {"status":"draft"}`. A URL edit without matching approval fails validation. A truly different video creates a different watched identity even when the resource ID stays the same, so it starts unwatched. Other videos' progress and all notes remain intact.
- **Embedding restricted:** set `video.embedPolicy` to `link-only`. The student gets Watch on YouTube instead of a broken/empty frame. `allowed` means offer a provider-controlled embed; it is not a guarantee against regional, school-network, age or provider restrictions.
- **Future new approved video:** create a new stable ID, exact URL and video ID, scoped topic IDs, order and part where verified, with a dated explicit approval reference. Do not extend the one-time initial authorization to unrelated new links, other creators or other subjects. Preserve `INITIAL_KRUG_APPROVAL.json` as the original audit, not a standing allowlist to edit silently.

Use a single completed edit (or write to a temporary sibling and rename it) rather than leaving half-written JSON while Local Preview is reading the file. Temporary files must not be committed.

## Validate and preview

From the project folder:

```sh
pnpm typecheck
pnpm test:unit
pnpm build
pnpm test:smoke
pnpm test:workspace
pnpm test:publication
```

Keep the existing development preview running at port 3000 for the HTTP tests. Production validation uses a separate port and `.next` output; development uses `.next-preview`. Never start competing development servers or clear an active server's output.

The initial-collection test intentionally freezes the verified import's titles/URLs/counts. For an owner-authorized later correction, update the relevant test expectation and record the new approval/provenance; do not rewrite the old verification report to pretend the replacement was in the original import. Run resource policy tests before saving a checkpoint.

Open `/courses/chemistry/<topicId>` and check its count, selected title, part order, Play, Watch on YouTube, fullscreen, Mark as Watched/Undo, notes and topic-specific Practice. Changing notes or study-material tabs must leave the same player mounted. A different selected video may start from the beginning after Play; returning does not preserve the old video's playback position. Watched status is manual, never inferred from playback.

## Known directory issue

Both 9.8a and 9.8b link to `Sl5mJT0tvSE`, whose current provider title identifies Topic 8a. PrepAtlas publishes it once as Part A. The separate Part B entry is pending because no distinct URL was verified. Do not invent or search-import a substitute without the owner's approval. Topic 9.8 still has its eleven MCQs and one verified lesson.

## AP Calculus AB — initial Flipped Math Version 1 collection

The October 19 one-time authorization covers only the 81 exact URLs in `docs/INITIAL_FLIPPED_MATH_APPROVAL.json`. Research and topic mappings are in `content-drafts/calculus-ab/research/FLIPPED_MATH_V1_VERIFICATION.json`; all 81 initial videos have matching public The Algebros metadata. There are currently no verified multipart Calculus lessons: do not invent Part A/B labels or add an unnecessary one-item tab. The shared player already supports multiple future explicitly approved lessons.

Find a Calculus topic using `content-drafts/calculus-ab/research/official-topics.json` or the course registry. Always include `courseId: calculus-ab` when finding a record; Chemistry can have similarly named topic IDs. For example Topic 7.3 uses topic ID `topic-7-3` and resource ID `flippedmath-calculus-ab-v1-7-3`; Topic 1.1 retains legacy ID `limits`. Search the central catalog by resource ID.

Correct a mapping in `unitNumber`/`topicIds`, change `order` for sequencing, or set `visibility` to `hidden`/`published` to hide/restore. Keep the stable resource ID. For a replacement URL, the owner’s exact replacement instruction supplies new authorization; verify the new ID/title/creator, update `url`, `video.videoId`, provenance and the dated approval reference/approvedUrl. Otherwise keep it draft. Never rewrite the frozen initial ledger to pretend a future URL belonged to this import. A changed video ID starts a new watched identity; notes, topic completion and unrelated videos remain intact.

For a future approved multipart topic, add each distinct verified video as its own record with explicit integer order and a part label only when verified. Keep one record per actual YouTube ID per course; share topicIds only within a unit. The existing tabs, keyboard navigation and Previous/Next automatically apply. No new player or public editor is needed.

Validate with `node --experimental-strip-types scripts/check-flippedmath-inventory.mjs`, the unit/type/build checks above, and all topic workspace checks. Open `/courses/calculus-ab/<topicId>` to inspect its lesson, original link, manual watched status, optional notes and the matching eleven-question Practice link. The research script never publishes; after this initial import it requires a separate output path and cannot overwrite the frozen initial evidence by default. Do not auto-import future playlists or replacements.
