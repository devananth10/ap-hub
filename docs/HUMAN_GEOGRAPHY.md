# Human Geography: course and two-instructor video checkpoint

Baseline: `cd5d5e5eefd2894feeafd6a1bd3a7fd2b7253ed9`. No Human Geography registry or MCQ bank existed there. The course is now registered as `human-geography` in the shared selector, dashboard, search, navigation, notes and Practice filters, with fixed geography artwork. Existing student course selections are preserved.

## Curriculum

The current [College Board course page](https://apcentral.collegeboard.org/courses/ap-human-geography), linked [CED](https://apcentral.collegeboard.org/media/pdf/ap-human-geography-course-and-exam-description.pdf), course-at-a-glance and [June 2026 clarifications](https://apcentral.collegeboard.org/media/pdf/ap-human-geography-course-and-exam-description-clarifications.pdf) were checked for 2026–27. The framework remains effective Fall 2020; clarifications concern front matter, resource locations and Progress Check wording, not new topics.

Seven units contain **68 topics**, counts **7, 12, 8, 10, 12, 11, 8**. All 68 numbered CED headings independently matched after whitespace/punctuation/diacritic normalization. The PDF hash, official names and stable IDs are in `content-drafts/human-geography/research/official-topics.json`; runtime data is `src/config/human-geography-curriculum.json`. IDs are `topic-<unit>-<topic>`, scoped by course. Topic 3.4 is officially **Types of Diffusion**, regardless of provider-title wording. Every topic has a working study page; `workspaceReady` distinguishes notes/navigation availability from video availability if a lesson is later withdrawn.

## Initial collection and authorization

The owner's automatic-video-approval UPDATE superseded the earlier pending-only instruction for this initial collection. Exact approved URLs are frozen in `INITIAL_HUMAN_GEOGRAPHY_APPROVAL.json`. No future collection/replacement, unrelated creator or public deployment is authorized by that exception.

| Instructor | Discovered unique videos | Verified/published topic lessons | Unmapped extras withheld |
| --- | ---: | ---: | ---: |
| Mr. Sinn | 77 | 68 | 9 |
| Heimler's History | 72 | 68 | 4 |
| Total | 149 | 136 | 13 |

**68 topics have both instructors; zero have only one or neither.** Each instructor currently has one lesson per topic. No multipart labels were invented. The shared player supports future approved multipart and same-unit multi-topic lessons. Research covers fourteen unit playlists discovered directly on the two official public channel pages, not every historical upload or paid collection.

`research/VIDEO_VERIFICATION.json` records exact URLs/IDs, actual titles, creator/channel, matching explicit topic numbers, source playlists, page/metadata hashes and offered embed metadata. Titles were compared with the corresponding official topic names; duplicate IDs and conflicting units were checked. No playlist has an unprocessed continuation. The thirteen extras are reviews, strategy videos or announcements without precise topic mappings; their exact URLs and reasons remain in the ledger's pending list and never enter the live catalog/client props. Metadata and title checks are not full lecture viewing or independent human review. No transcripts, worksheets, assessments or media were copied. No creator endorsement is implied. Provider-owned iframe recommendations are not PrepAtlas library entries.

## Instructor and persistence behavior

Mr. Sinn is the default preference. The native-radio selector appears with two available instructors; one instructor is shown without a useless switch; neither yields a coming-soon panel without an iframe. If a preferred lesson is unavailable, fallback does not overwrite the preference. Only the chosen instructor's videos appear in the player, lesson tabs/Previous/Next and resource cards. Switching instructors starts a click-to-play poster; notes/material panels keep the selected playing iframe mounted.

An optional additive `preferredInstructors["human-geography"]` field uses existing `ap-hub:v1` storage. Legacy records remain valid. Notes retain course/topic keys. Watched identity remains stable resource ID plus exact video ID, independently of instructor preference, notes, topic completion and session scores. No storage reset or automatic watched completion was added.

## Executed verification

- TypeScript, production build and **118 automated tests** passed. New tests cover seven/68 registry scopes, exact 136 approvals, withheld extras, wrong creator/channel/ID/topic mutations, actual selector markup, both/one/neither availability, fallback, multiple same-instructor fixtures, preference round trips and watched separation. Fixtures never reach student pages/providers.
- All 68 new topic pages, seven unit scopes, course scope and 68 empty topic Practice routes passed: one player, default Sinn, two instructor options, hidden notes, correct zero-MCQ scope and no pending URLs/unsolicited iframe.
- Existing standard routes/CSS/invalid routes/artwork checks, all 81 Calculus Practice/topic scopes, 91 Chemistry Practice scopes, 172 existing workspaces and Chemistry frozen publication checks passed. Eighty preview requests passed without retries/new manifest errors; this does not prove the historical intermittent issue permanently fixed.
- Browser: Heimler Topic 1.1 and Sinn Topic 1.2 actually played. Desktop/mobile page fullscreen entry/exit, keyboard-arrow instructor changes, preference refresh/topic navigation, notes across switching/refresh and separate persistent watched status passed. Temporary note/watched edits were restored. Human Geography Practice retained the correct topic and showed coming soon. Mobile 390×844 was inspected. This is representative playback, not full viewing of all 136 videos or physical-device certification.
- All **1,892 existing question objects**, publication registry/counts, Practice components and **183 existing video records** were compared with the baseline and preserved. No feedback submissions, public deployment, paid API or database change occurred.

## Question phase

At this course/video checkpoint there are **zero Human Geography MCQs**. The subsequent master prompt authorizes the next phase: **68 × 11 = 748** original validated MCQs, automatically published in checked batches, with 35–40% meaningful map/data/pyramid/model stimuli and all-four-option explanations. Do not count decorative artwork or copy third-party assessments. This report records the foundation milestone; the Human Geography progress tracker records later actual question counts.

Run `pnpm test:human-geography` against a running preview, plus unit/type/build checks. Research never publishes; initial evidence is frozen by default. Editing instructions: `VIDEO_EDIT_GUIDE.md`.

A repeat sandboxed build encountered Windows EPERM while creating a generated _global-error folder. Rerunning with normal workspace permissions completed successfully, followed by TypeScript. The live .next-preview server was preserved; no generated folder or student data was deleted. No general Windows/OneDrive fix is claimed.
