# Shared lesson and Practice refinement — 2026-10-21

Recovered and completed the interrupted interface changes after the complete Geography audit at b0ad13d. No question files, resource URLs or browser-storage keys changed.

- Canonical topic title and course/unit/topic breadcrumbs; unit links open the correct outline section.
- Selected-instructor counts are distinct from the total collection. Manual topic completion, watched videos and session scores are described separately.
- One primary inline Start Practice action, with a separate-page text link. Optional notes and the persistent player remain in place.
- Secondary scoring instructions use a native keyboard-accessible disclosure; first-graded-answer scoring is unchanged.
- Appropriate Geography stimuli use two columns only in a sufficiently wide container. Mobile and larger/complex figures stay stacked.
- Removed redundant single-series A labels, including hug-4-1-003. Grouped-series letter keys, numerical data, legends and equivalent tables remain.

Checks: 196 unit tests, TypeScript, production build, general smoke, all 172 Chemistry/Calculus lesson routes, all 68 Geography lesson/Practice routes and the complete 2,640-question preservation gate passed. Browser checks covered notes opening without editing, inline Practice focus, scoped separate Practice, selected-instructor counts, Unit 4 expansion, 1536px two-column and 390px stacked layouts, question navigation, correct grading/explanations and keyboard zoom to 200%. No document overflow at 390px. Instructor preference and viewport were restored. Video network playback is not certified by these checks.

The stopped local preview was restored at port 3000 without deleting caches or stored student data. Summary generation is the next phase; the demo remains until replaced by the validated summary system. These automated checks do not constitute independent human review.
