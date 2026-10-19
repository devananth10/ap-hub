// Local owner tool: never expose this through an API or upload its output.
import { readFileSync } from 'node:fs';
import { feedbackDatabasePath, openFeedbackStore, moderateReview, updateReportStatus } from '../src/lib/feedback-store.ts';

const [command,...args] = process.argv.slice(2);
if (!['status','reviews','reports','review-status','report-status'].includes(command)) {
  console.log('Usage: node --experimental-strip-types scripts/feedback-admin.mjs status|reviews|reports [question-id]|review-status <id> pending|rejected|approved [--public-text-file <file> --confirm-privacy-review]|report-status <id> new|reviewed|resolved');
  process.exitCode = 1;
} else {
  let db;
  try {
    db = openFeedbackStore();
    if (command === 'status') console.log(JSON.stringify({database:feedbackDatabasePath(),reviews:db.prepare('SELECT moderation_status,COUNT(*) AS count FROM reviews GROUP BY moderation_status').all(),reports:db.prepare('SELECT status,COUNT(*) AS count FROM question_reports GROUP BY status').all()},null,2));
    if (command === 'reviews') console.log(JSON.stringify(db.prepare('SELECT * FROM reviews ORDER BY created_at,id').all(),null,2));
    if (command === 'reports') console.log(JSON.stringify({groups:db.prepare('SELECT question_id,COUNT(*) AS reports FROM question_reports GROUP BY question_id ORDER BY reports DESC,question_id').all(),reports:args[0] ? db.prepare('SELECT * FROM question_reports WHERE question_id=? ORDER BY created_at,id').all(args[0]) : db.prepare('SELECT * FROM question_reports ORDER BY question_id,created_at,id').all()},null,2));
    if (command === 'review-status') {
      const fileIndex = args.indexOf('--public-text-file');
      const excerpt = fileIndex >= 0 ? readFileSync(args[fileIndex+1],'utf8') : undefined;
      moderateReview(db,args[0],args[1],excerpt,args.includes('--confirm-privacy-review'));
      console.log('Review status saved.');
    }
    if (command === 'report-status') { updateReportStatus(db,args[0],args[1]); console.log('Report status saved.'); }
  } catch (error) { console.error(error.message); process.exitCode = 1; }
  finally { db?.close(); }
}
