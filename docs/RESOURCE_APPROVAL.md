# Official resource approval in PrepAtlas

**Separate October 19 exception:** The owner explicitly authorized one-time automatic publication of the initial verified Flipped Math/The Algebros Version 1 Calculus AB videos. All 81 exact URLs and the boundary of that authorization are frozen in `INITIAL_FLIPPED_MATH_APPROVAL.json`. All 81 AB topics have one video. BC-only topics, Version 2 and non-video applets are excluded. This exception does not authorize future URLs/replacements or unrelated resources. The earlier Krug collection remains unchanged. See [Flipped Math verification](FLIPPED_MATH_VERIFICATION.md).

**Only the application owner can approve an official resource.** The owner explicitly authorized one initial verified Jeremy Krug AP Chemistry directory collection on October 18, 2026. Its 102 exact unique URLs are recorded in `INITIAL_KRUG_APPROVAL.json`; all are now published. One duplicate-looking 9.8b directory alias remains pending as a distinct lesson. This exception does not approve future imports, replacement URLs, other creators or other subjects. Normal manual approval resumes outside that recorded collection.

The live catalog is `src/config/official-resources.json`. The previously selected unapproved resources remain removed. The new catalog contains the initial owner-authorized collection with verified creator-directory mapping, public titles and source provenance. Never import a playlist. See [VIDEO_EDIT_GUIDE.md](../VIDEO_EDIT_GUIDE.md) and [VIDEO_VERIFICATION.md](VIDEO_VERIFICATION.md).

## Add a resource

1. Receive an exact URL from the owner, with its intended course, unit, and topics. A preference for a creator, channel, or website is not approval of an individual resource.
2. Add the metadata below with `approval.status` set to `draft`. Drafts are validated but never passed to student pages or client components.
3. Only after explicit approval of that exact URL, replace the approval object with the owner approval record below. Use the actual approval date and a clear reference to the owner's instruction. Never manufacture an approval record.
4. Run `pnpm test:unit`, `pnpm typecheck`, `pnpm build`, and the HTTP checks. Review the local preview before committing/pushing the milestone.

Metadata template (replace every placeholder before adding this to the JSON file):

```json
{
  "id": "chemistry-topic-1-5-lesson-one",
  "title": "OWNER-CHOSEN LESSON TITLE",
  "publisher": "OWNER-CHOSEN CREATOR",
  "description": "Your own short description; do not copy lesson text.",
  "kind": "video",
  "url": "EXACT OWNER-SELECTED YOUTUBE URL",
  "courseId": "chemistry",
  "unitNumber": 1,
  "topicIds": ["electron-configuration"],
  "video": { "provider": "youtube", "embedPolicy": "allowed" },
  "approval": { "status": "draft" }
}
```

After the owner approves the exact URL, the approval object becomes:

```json
{
  "status": "approved",
  "approvedBy": "owner",
  "approvedOn": "YYYY-MM-DD",
  "approvedUrl": "EXACT OWNER-APPROVED RESOURCE URL",
  "reference": "Reference to the owner's explicit approval of this exact URL"
}
```

This configuration records the owner's editorial decision; it cannot itself prove consent. Anyone editing it must follow the owner-only approval rule. It is not a substitute for a future authenticated administration system.

Drafts are not featured on PrepAtlas, but this repository is public: anyone who reads its source can see configuration entries. Draft configuration is not a place to keep confidential URLs or notes.

## Associations and types

- `courseId`: an existing course ID in `src/lib/courses.ts`.
- `unitNumber`: an existing unit in that course.
- `topicIds`: existing topic IDs within that unit. Use `[]` for a resource that belongs to the whole unit; it will appear in each topic in that unit.
- `kind`: `video`, `reading`, `guide`, or `reference`.
- `url`: HTTPS only, without usernames/passwords in the URL.
- `video`: required for `kind: "video"`; omit it for other resource types.
- `embedPolicy`: `allowed` offers a click-to-load YouTube player, with the original link always available. Use `link-only` when embedding isn't permitted. Provider/network restrictions can still prevent playback; the original link is the fallback.
- `video.videoId`: must match the exact YouTube URL when present. Duplicate video IDs within a course are rejected; associate one resource with multiple topic IDs instead.
- `order`, `part`, `visibility` and `source`: define lesson ordering, verified part label, published/hidden visibility and directory verification provenance. Hidden and draft entries are filtered on the server. Reordering does not change resource IDs.

The parser accepts individual YouTube `watch?v=…` or `youtu.be/…` video URLs. It extracts one video ID and never imports a channel, transcript, or playlist. No provider API or external fetch runs when adding catalog metadata.

## Edit, unpublish, or remove

- Edit a title, original description, or assignment in the same entry and keep its stable ID.
- A different URL or replacement resource requires fresh owner approval. Return it to `draft` until that happens.
- `approval.approvedUrl` must exactly match the resource's `url`. Editing a URL without updating its approval record fails validation; update that record only after the owner approves the replacement.
- To unpublish, change the approval object to `{ "status": "draft" }`.
- To remove permanently from the live config, delete the entry. The owner's removal request is sufficient authorization to unpublish/remove it.
- Duplicate IDs, invalid assignments, unsafe URLs, incomplete approvals, and malformed video settings fail validation. Invalid configuration stops publication rather than quietly showing the resource.

## Saved resources and student privacy

The official library is exclusively the configuration file. Browser storage and student bookmarks cannot add to it. Existing saved IDs are retained across the rename and resource removals; an ID without a currently approved entry is shown as an unavailable saved reference, without exposing its old unapproved link. Reapproving the same stable ID makes that saved selection available again.

Student-authored private bookmarks are a future, separate feature. Do not put private URLs, notes, or student data in the official catalog or source repository. The current prototype stores only notes, course choices, completion, theme, and official bookmark IDs locally.

## Adding courses without redesigning the app

`src/lib/courses.ts` defines the course → units → topics hierarchy. `src/lib/lessons.ts` supplies the original study-tool content for ready topics. The resource catalog independently associates approved material with those IDs. Add a course only when requested; no full course catalog is automatically populated.

The workspace shell supports any registered topic, with optional notes and published Practice even before detailed original lesson text is written. Approved video resources also make course-outline/dashboard workspace availability ready, without renaming catalog IDs. Add a `Lesson` under `courseId/topicId` only when its original overview/summary is actually written; do not fabricate those from a video's title. Reuse shared components.

## Summary and practice boundaries

The existing six-bullet Topic 1.5 recap is original prototype text. Other topics honestly state when no sample summary exists. No video has been analyzed, no transcript fetched and no AI API connected. The 1,001 original Chemistry MCQs are already published and unchanged; scores are session-only. FRQs and mixed practice remain unavailable. Do not copy College Board questions without permission.

Human Geography initial exception: the owner’s automatic-video-approval update authorizes only the 136 verified initial Mr. Sinn/Heimler URLs in INITIAL_HUMAN_GEOGRAPHY_APPROVAL.json. It supersedes the earlier pending-only attachment instruction. Thirteen unmapped extras remain unpublished, and future collections/replacements require explicit authorization. See HUMAN_GEOGRAPHY.md.
