# Official resource approval in PrepAtlas

**Only the application owner can approve an official resource.** No video, playlist, website, study guide, or other external educational material may be added automatically. This rule applies to future development too.

The live catalog is `src/config/official-resources.json`. It deliberately starts with an empty `resources` array. The previous automatically chosen resources have been removed. No Jeremy Krug videos are approved yet: the owner will provide the exact URLs and their course/unit/topic assignments. Never import a playlist.

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

For a new ready topic, add its `Lesson` under `courseId/topicId`, then set that topic's `ready` flag. Reuse the existing course cards, outline, study workspace, video panel, notes, and resource cards. A topic can have functioning original study tools while waiting for approved external resources.

## Summary and practice boundaries

The six-bullet sample recap is original prototype text. No video has been analyzed, no transcript fetched, and no AI API connected. Real summaries will require accessible, authorized transcripts or other approved material. The MCQ is an original, unscored demonstration. Original MCQs/FRQs and a fuller question bank remain future work; do not copy College Board questions without permission.
