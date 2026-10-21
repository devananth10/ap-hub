import { BookOpen, X } from 'lucide-react';
import type { TopicSummary as Summary } from '@/lib/topic-summary-policy';
import { summaryWordCount } from '@/lib/topic-summary-policy';

export function TopicSummary({summary,onClose}:{summary?:Summary;onClose:()=>void}) {
  return <section id="topic-summary" className="summary-panel topic-summary" aria-label="Topic Summary">
    <div className="section-heading"><div className="inline-heading"><BookOpen size={20} aria-hidden="true"/><h2 tabIndex={-1}>Topic Summary</h2></div><button className="icon-button" aria-label="Close summary" onClick={onClose}><X size={18}/></button></div>
    {summary?<>
      <p className="summary-provenance">Original PrepAtlas review · {Math.max(1,Math.ceil(summaryWordCount(summary)/180))} min read</p>
      <p>{summary.overview}</p>
      <h3>Key concepts</h3><ul className="summary-concepts">{summary.keyConcepts.map(c=><li key={c.title}><strong>{c.title}. </strong>{c.text}</li>)}</ul>
      {summary.table&&<div className="practice-table-wrap" tabIndex={0} role="region" aria-label={summary.table.caption}><table className="practice-table"><caption>{summary.table.caption}</caption><thead><tr>{summary.table.headers.map(h=><th scope="col" key={h}>{h}</th>)}</tr></thead><tbody>{summary.table.rows.map((row,i)=><tr key={i}>{row.map((cell,j)=>j===0?<th scope="row" key={j}>{cell}</th>:<td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>}
      <h3>Worked example</h3><p>{summary.example.prompt}</p><ol>{summary.example.steps.map(step=><li key={step}>{step}</li>)}</ol><p className="summary-result">{summary.example.conclusion}</p>
      <h3>Common misconception</h3><p>{summary.misconception}</p><h3>Apply it on the AP exam</h3><p>{summary.apTip}</p>
      <p className="summary-provenance">Pre-written topic review. No video analysis or live AI generation.</p>
    </>:<p>This topic’s summary is being prepared and checked. Your lessons, optional notes and Practice remain available.</p>}
  </section>;
}
