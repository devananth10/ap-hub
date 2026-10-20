# Initial Flipped Math Version 1 research

Research completed 2026-10-19 after complete-bank checkpoint `cca505aec00bdd9799adcb5496f2206494b34371` was pushed and its remote SHA verified.

The owner authorized one-time automatic publication of the initial verified Flipped Math/The Algebros Version 1 Calculus AB collection. This applies only to the exact verified initial video URLs, not future replacements, other resources or public deployment.

- Source: https://calculus.flippedmath.com/list-of-lessons.html
- Only links inside the directory's Version #1 navigation were selected. Version #2 was not used.
- All 81 official AB topic pages were fetched and hashed; each maps to its stable existing PrepAtlas ID.
- 81 unique YouTube IDs: one per topic, zero duplicates and zero multipart sets.
- All 81 returned public YouTube oEmbed metadata: matching The Algebros creator/channel, matching topic number/title and an offered embed iframe.
- Thirty BC-only topic links were excluded using the official 81-topic inventory; two prerequisite links were also not imported.
- Four GeoGebra applet occurrences on Topics 2.1, 2.2, 7.3 and 7.4 are non-video resources outside the authorization and are excluded. Their separate presence does not invalidate each page's verified YouTube lesson.
- Pending video links: none in this inventory. Any later failed/mismatched metadata must stay pending.

Evidence is FLIPPED_MATH_V1_VERIFICATION.json. `scripts/research-flippedmath.mjs` collects public source/metadata without downloading media, transcripts, worksheets or keys and never writes the live catalog. `scripts/check-flippedmath-inventory.mjs` validates the saved evidence offline. Once the initial approval ledger exists, the research script requires a separate output path for later research and will not overwrite the frozen initial evidence by default.

This verifies directory mapping and public provider metadata, not full lecture viewing, transcript analysis or independent mathematical review of every video. Shared AB/BC titles are retained as published by the provider; BC-only numbered lessons are excluded. Metadata offering an iframe is evidence of embedding support, not a guarantee of playback on every browser, network or region. The original-source fallback is required.

Next: preserve all 102 Krug records, record the exact one-time approved URLs, append only eligible videos to the existing official manifest, reuse the shared player, test all 81 topic routes and controls, then run the full regression/build checks and verify the GitHub push.
