# Reviews and question reports

Both forms save to the **PrepAtlas Node server**, not browser storage. The footer opens Rate PrepAtlas; the red outline flag beside the current Practice question number opens Report a Question. Nothing opens automatically. Reports do not alter questions, answers, grades or student progress.

## Current persistent destination

On this Windows computer the default is `%LOCALAPPDATA%\PrepAtlas\feedback.sqlite` (normally `C:\Users\devan\AppData\Local\PrepAtlas\feedback.sqlite`). It is created on the first submission session. This is outside the Git repository and OneDrive project folder. All browsers connecting to this same server share that destination. Restarting Next.js does not remove it. No external service account, paid service or API key is needed.

Node 22.18+ is required; tested here with Node 24.19. The built-in `node:sqlite` API is used. Server permissions must allow the owner to create/write the database and its adjacent WAL/SHM files. Errors return a retryable failure, never a fake success. Set `PREPATLAS_FEEDBACK_DISABLED=1` on the server to explicitly stop submissions. A missing/unreadable public review store hides the public section; a failed submission remains an error.

For future hosting, set server-only `PREPATLAS_FEEDBACK_DB` to an **absolute path on a private, persistent writable disk**, outside `public/`, source control, build output and synced folders. Behind an HTTPS reverse proxy also set `PREPATLAS_PUBLIC_ORIGIN` to the exact browser origin (scheme and host, no trailing slash) and configure the proxy to reject unexpected Host headers. Locally the browser destination Host and request scheme determine the allowed origin. Run all instances against the same supported storage strategy: this SQLite implementation is for a single Node host and local disk, not multiple distributed instances or a network filesystem. Static hosting, ephemeral serverless disks and Edge runtimes do not provide this persistence. Before any public launch, choose/configure persistent hosting or replace this storage adapter with a shared managed database; verify restart/backup/recovery and HTTPS. No public deployment or future hosting destination is configured in this milestone. Local feedback works now; this does not claim production readiness.

## Owner access (local terminal only)

Open a terminal in the existing StudyHub project folder, then:

```text
pnpm feedback:admin status
pnpm feedback:admin reviews
pnpm feedback:admin reports
pnpm feedback:admin reports chem-5-3-007
pnpm feedback:admin report-status REPORT_UUID reviewed
pnpm feedback:admin report-status REPORT_UUID resolved
pnpm feedback:admin review-status REVIEW_UUID rejected
pnpm feedback:admin review-status REVIEW_UUID pending
```

The last two statuses remove a previously approved review from public display without deleting its original private record. Report output groups by stable question ID and also includes each original submission. Use the **actual ID from the report**, not an assumed naming pattern. The database saves canonical course ID/name, unit, topic ID/number, the student's displayed session position and server timestamp. Session position is not the question's permanent identity: quote the stable ID when requesting a correction. Consult `CONTENT_IMPORT_GUIDE.md` and the relevant published JSON in `src/content/practice/`; make targeted reviewed fixes, not a bank regeneration.

All command output is private. Do not post screenshots/exports of raw feedback publicly or commit them. There is no web admin endpoint, private-feedback GET API or browser-side administrative credential. Anyone with this OS account's filesystem access can read/moderate the database; protect that account and restrict server disk access. Existing server access logs/hosting logs are separate from this store.

### Public review approval

All incoming reviews are pending, and public opt-in is **unchecked by default**. Private submissions can never be approved for display. Even opted-in text is not automatically displayed.

1. Read an opted-in review privately. Moderate for spam, safety, privacy and relevance, **not rating or criticism**. Low ratings use the same process as high ratings.
2. Create a UTF-8 text file outside the repository containing the explicit public excerpt. Remove names, schools, contact details and any other identifying information; preserve the student's meaning. An empty file permits a genuine star-only review. Do not invent a testimonial or copy private-only feedback.
3. Publish that excerpt only after reviewing its privacy:

```text
pnpm feedback:admin review-status REVIEW_UUID approved --public-text-file C:\private\review-excerpt.txt --confirm-privacy-review
```

The command refuses approval without student opt-in, an explicit excerpt file and the privacy-review flag. Common links/contact details are screened, but this cannot detect all personal details; **owner privacy review remains necessary**. Raw text stays separate from the public excerpt. The homepage displays up to the 12 most recent approved, opted-in reviews with their actual stars, escaped plain text and “PrepAtlas student.” It shows no section when empty, no fabricated reviews and no aggregate rating. Refresh the homepage after moderation. Private text, record IDs and report details are never sent to its public component.

## Validation and abuse controls

Server validation requires integer ratings 1–5, valid UUID submission IDs, known question IDs, one of five report categories, integer displayed positions and at most 500 text characters. Unknown fields (including selected answers and client-supplied course data) are rejected. Bodies are stream-limited to 4 KiB. JSON and same-origin POSTs are required; there is no CORS access. Cookies are HttpOnly, SameSite Strict, Secure on HTTPS and limited to the feedback API path. A short-lived random session is used only for abuse protection; its hash expires after two hours. No IP address, user agent, name, email, school, selected answer, full question or browser study data is collected by these forms. Free text can contain personal details despite the warning; keep raw records private.

SQLite transactions, bound parameters and durable receipts prevent partial saves and duplicate retries. The browser keeps the submission ID while retrying an unchanged form. A honeypot rejects simple spam. Durable limits are 3 reviews / 20 reports per anonymous session per hour, 200 total accepted submissions per server hour, 1,000 new feedback sessions per hour and identical-content suppression per session for ten minutes. Cookie resets can evade per-session limits; the global cap is a backstop, not full bot protection. Session issuance limits can also temporarily prevent genuine submissions during abuse. Before public launch evaluate hosting-layer request limits, monitoring and load; do not add fingerprinting or assume anonymous limits stop all attacks.

Errors preserve the open form for retry. A network timeout might occur after the server committed; retrying that form uses the same receipt ID. Closing/reopening loses the form draft; use Retry while it is open if confirmation was uncertain. Closing a dialog does not undo an already accepted submission.

## Backups and retention

The database is intentionally excluded from Git (`*.sqlite`, WAL/SHM and `*.db` patterns). GitHub backs up **code only**, not feedback. Set a private backup/retention policy before live student use; no automatic deletion/retention or backup scheduler is configured yet. To back up safely while the server runs, use SQLite's online backup mechanism (Node `node:sqlite` `backup`) rather than copying only the main file while WAL writes may be pending. Store backups privately with the same access restrictions. Verify restoration into a separate database before relying on them. Do not delete student data or clear the database to troubleshoot preview errors.

## Checks

`pnpm test:unit` includes isolated temporary SQLite tests (synthetic fixtures never enter the real public review catalog). Tests cover five ratings/categories, validation, canonical ID metadata, persistence after reopening, private/public moderation gates, low-star publication, duplicate receipts, rate limits, malformed/oversized/cross-origin requests and failure responses. Existing question, resource, Practice and watched-state tests remain in place. Browser checks additionally verify state preservation and responsive dialogs. Practice scores still last only for the active session; this milestone does not add score history.
