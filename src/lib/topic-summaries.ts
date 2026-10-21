// Server-side catalog: only the current topic's summary crosses the client boundary.
import { createHash } from 'node:crypto';
import chemistry from '../content/topic-summaries/chemistry.json' with { type: 'json' };
import calculus from '../content/topic-summaries/calculus-ab.json' with { type: 'json' };
import geography from '../content/topic-summaries/human-geography.json' with { type: 'json' };
import { courses } from './courses.ts';
import { validateTopicSummary, type TopicSummary } from './topic-summary-policy.ts';

export const topicSummaryCatalog = [...chemistry,...calculus,...geography] as TopicSummary[];
export function summaryHash(s: TopicSummary): string {
  const {contentHash: _hash,...validation}=s.validation;
  return createHash('sha256').update(JSON.stringify({...s,validation})).digest('hex');
}
export function getTopicSummary(courseId: string, topicId: string): TopicSummary | undefined {
  const matches=topicSummaryCatalog.filter(s=>s.courseId===courseId&&s.topicId===topicId);
  if(matches.length!==1)return;
  const s=matches[0];
  try {
    return s.status==='published'&&s.validation.status==='validated'&&!validateTopicSummary(s,courses).length&&summaryHash(s)===s.validation.contentHash?s:undefined;
  } catch { return undefined; } // Malformed or incomplete entries never reach students.
}
