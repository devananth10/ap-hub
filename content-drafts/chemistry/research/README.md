# Unpublished Chemistry research

> Current status: this directory retains historical source research. The owner later authorized the initial verified collection once; 102 unique videos are published across 91 topics. The duplicate 9.8b alias remains pending as a separate lesson. Read `docs/VIDEO_VERIFICATION.md` and `docs/INITIAL_KRUG_APPROVAL.json` for current status and evidence.


These files are editorial research, not application resources. Nothing here is registered in `src/config/official-resources.json`, which remains empty. Do not import this directory into a page or client component.

- `official-topics.json`: all 91 numbered topics, official titles, printed/PDF page references, source edition/access date/hash.
- `video-candidates.json`: exact links and topic labels from [Jeremy Krug's index](https://jeremykrug.com/ap-chem-videos/), retrieved 2026-10-17. Public YouTube oEmbed metadata returned HTTP 200 for all 103 links, and all returned author display names matched Jeremy Krug. Topic coverage is 91/91 according to the index labels.
- `VIDEO_REVIEW.md`: a readable topic/link list for the owner's review. Every entry is pending approval.

Metadata verification is limited: the `creatorIdentityMatched` field records a returned author **display-name match**, not independent account-ownership or verified-badge certification. Association with the creator also relies on the exact link appearing on the creator's own index. Lessons were not watched or transcribed, and detailed content alignment, school/regional access, actual playback, and embedding permission remain unverified. No AI analysis was performed. A successful oEmbed response is not owner approval or proof that a player will work in every browser.

To approve a resource, the owner must explicitly identify its exact URL and intended topic(s). Then follow `docs/RESOURCE_APPROVAL.md`; the preferred channel or this list alone is not approval. Preserve any already approved catalog entries when acting on a future approval. No automatic playlist import or bulk publication is authorized.

Reproduction tools: `scripts/extract-chemistry-research.py` reads the cached CED and index under ignored `tmp/pdfs/`; rerunning it recreates source inventories and resets video metadata verification, so run the separate metadata checker afterward. `scripts/verify-video-candidates.mjs` only performs public metadata lookups, uses two workers and bounded timeouts, and stops on rate limiting. `scripts/register-chemistry-curriculum.mjs` is the initial ID migration and safely does nothing after registration; do not use it to replace stable mappings.
