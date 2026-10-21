# Student data and retention — owner-review draft

No real cloud account or private student data was created during implementation. This is a technical inventory and policy draft, not a compliance certification.

| Data | Location | Retention / removal |
|---|---|---|
| Guest notes, courses, completion, saved IDs, instructor preference, watched identities, last topic | `ap-hub:v1` in this browser | Preserved through sign-in/import/sign-out; browser clearing or deliberate user removal removes it. No silent account assignment. |
| Guest finished Practice history | `prepatlas:guest-attempts:v1` | Kept until browser clearing; stable attempt IDs, no automatic truncation. Historical session-only results were never saved and cannot be recovered. |
| Theme | `ap-hub:theme` | Device preference, no sensitive account data. |
| Auth session / PKCE verifier | Supabase SSR cookies | Provider-managed expiry/refresh; only verified getUser/getClaims authorizes private operations. Normal SSR client cookies are browser-readable by design; never claim HttpOnly token storage or immunity to XSS. |
| Recovery proof | HttpOnly, SameSite cookie, signed with server secret | Ten minutes, bound to user + verified session, cleared after successful reset. Not a password or substitute for Supabase verification. |
| Account cache, pending changes and conflict recovery | `prepatlas:account:v1:USER:TAB` and recovery suffixes | Accessed by UI only after verifying that owner. Preserved on sign-out for safe recovery; not encrypted at rest. Shared-browser developer tools/physical access can inspect browser storage, so separate browser profiles are recommended. Account deletion clears this browser's own account keys; other devices require deliberate cleanup. |
| Profiles, notes, completion, preferences, watched status, selections, saved IDs, completed attempts, import receipts | Supabase PostgreSQL when configured | Private ownership/RLS. Active rows cascade-delete with Auth user. No automatic inactivity purge is implemented; owner must adopt and communicate a retention schedule before launch. |
| Email and optional Google identity | Supabase Auth / Google | Managed by provider and its terms/settings. No custom password table or hashing. Only basic identity scopes requested; minimal optional display name. |
| Existing reviews/question reports | Existing separate feedback system | Unchanged. Account deletion does not identify/remove unrelated historical anonymous feedback automatically. Review `docs/FEEDBACK.md` and owner moderation/retention procedures. Never submit sensitive information in reports. |
| Exports, provider backups, operational/access logs, caches on other devices | Respective storage/providers | Deleting active account rows cannot erase independent exports or backups immediately. Owner must verify actual plan/backup/log retention and establish deletion/incident procedures. Never log note bodies, passwords, OAuth codes or recovery tokens in application diagnostics. Review infrastructure access logs for URL token handling. |

No student advertising, public scoreboards, legal names, birth dates, school identifiers or phone numbers were added. Notes/scores are not used for admissions, official grades or public ranking. Scores are personal study records, not tamper-proof assessments. Client-submitted score counts are bounded and internally consistent; stable attempt records are immutable through the student RPC. No claim of independent human grading or educational-outcome certification.

The owner must resolve operator capacity to contract, age eligibility/consent, relevant state/country requirements, school arrangements, data processing region, access/export/deletion requests and a contact before opening registration. Current primary sources and exact setup/live tests are consolidated in OWNER_SETUP_TODO.md. No claim of COPPA, FERPA or GDPR compliance is made.
