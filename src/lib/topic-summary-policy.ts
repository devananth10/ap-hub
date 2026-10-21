import type { Course } from './courses.ts';
import { validateGeographyStimulus, type GeographyStimulus } from './geography-stimuli.ts';
import type { PracticeFigure } from './practice-figures.ts';

export type SummaryCheck = { operation: 'sum' | 'product' | 'quotient' | 'difference' | 'power'; operands: number[]; expected: number; evidence: string };
export type TopicSummary = {
  schemaVersion: 1; courseId: string; topicId: string; topicNumber: string; unitNumber: number; title: string;
  status: 'draft' | 'published'; overview: string; keyConcepts: { title: string; text: string }[];
  example: { prompt: string; steps: string[]; conclusion: string };
  misconception: string; apTip: string;
  table?: { caption: string; headers: string[]; rows: string[][] };
  figure?: GeographyStimulus;
  mathFigure?: PracticeFigure;
  validation: { status: 'pending' | 'validated'; checkedAt: string; scope: string; reasoning: string; checks: SummaryCheck[]; contentHash: string };
};

export function summaryText(s: TopicSummary): string {
  return [s.overview, ...s.keyConcepts.flatMap(c => [c.title,c.text]), s.example.prompt, ...s.example.steps, s.example.conclusion, s.misconception, s.apTip, ...(s.table ? [s.table.caption,...s.table.headers,...s.table.rows.flat()] : []), ...(s.figure?[s.figure.title,s.figure.description,s.figure.caption]:[]), ...(s.mathFigure?[s.mathFigure.title,s.mathFigure.description,s.mathFigure.caption]:[])].join(' ');
}
export function summaryWordCount(s: TopicSummary): number { return summaryText(s).trim().split(/\s+/u).length; }
export function recomputeCheck(c: SummaryCheck): number {
  const [a,b] = c.operands;
  switch(c.operation) {
    case 'sum': return c.operands.reduce((x,y)=>x+y,0);
    case 'product': return c.operands.reduce((x,y)=>x*y,1);
    case 'quotient': return a/b;
    case 'difference': return a-b;
    case 'power': return a**b;
    default: return NaN;
  }
}
export function validateTopicSummary(s: TopicSummary, courses: Course[]): string[] {
  const errors: string[] = [];
  const course=courses.find(c=>c.id===s.courseId),unit=course?.units.find(u=>u.number===s.unitNumber),topic=unit?.topics.find(t=>t.id===s.topicId);
  const validText=(v: unknown)=>typeof v==='string'&&v.trim().length>0;
  if(s.schemaVersion!==1||!['chemistry','calculus-ab','human-geography'].includes(s.courseId))errors.push('Unsupported summary schema/course');
  if(!topic||topic.number!==s.topicNumber||topic.title!==s.title)errors.push('Canonical course/unit/topic mapping mismatch');
  if(!['draft','published'].includes(s.status))errors.push('Invalid publication status');
  if(!validText(s.overview)||!validText(s.misconception)||!validText(s.apTip)||!Array.isArray(s.keyConcepts)||s.keyConcepts.length<3||s.keyConcepts.length>5||s.keyConcepts.some(c=>!validText(c.title)||!validText(c.text)))errors.push('Missing overview, concepts, misconception or AP application');
  if(!s.example||!validText(s.example.prompt)||!validText(s.example.conclusion)||!Array.isArray(s.example.steps)||s.example.steps.length<2||s.example.steps.some(p=>!validText(p)))errors.push('Incomplete original worked example');
  if(errors.length)return errors;
  const words=summaryWordCount(s);if(words<150||words>250)errors.push(`Reading length ${words}; expected 150–250 words`);
  if(/https?:\/\/|<\/?\w|owner.approved|human.reviewed|video.{0,15}analy[sz]ed|as an ai|lorem ipsum/iu.test(summaryText(s)))errors.push('Unsupported markup, external resource or misleading provenance');
  if(s.table&&(!validText(s.table.caption)||s.table.headers.length<2||s.table.rows.length<1||[...s.table.headers,...s.table.rows.flat()].some(v=>!validText(v))||s.table.rows.some(r=>r.length!==s.table!.headers.length)))errors.push('Invalid accessible table');
  if(s.figure)try{validateGeographyStimulus(s.figure);}catch{errors.push('Invalid original summary figure');}
  if(s.mathFigure){
    const f=s.mathFigure;
    const range=(r:number[])=>Array.isArray(r)&&r.length===2&&r.every(Number.isFinite)&&r[1]>r[0]&&r[1]-r[0]<=24;
    const point=(p:number[])=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite)&&p[0]>=f.xRange[0]&&p[0]<=f.xRange[1]&&p[1]>=f.yRange[0]&&p[1]<=f.yRange[1];
    if(!validText(f.title)||!validText(f.description)||!validText(f.caption)||!range(f.xRange)||!range(f.yRange)||!Array.isArray(f.curves)||!f.curves.length||f.curves.some(c=>!Array.isArray(c.points)||c.points.length<2||!c.points.every(point)||!['open','closed'].includes(c.start)||!['open','closed'].includes(c.end))||!Array.isArray(f.dots)||!f.dots.every(d=>point([d.x,d.y]))||f.slopeField)errors.push('Invalid original mathematical summary figure');
    if(f.curves.length>2||f.curves.length===2&&(!f.curves.every(c=>validText(c.label))||!!f.curves[0].dashed===!!f.curves[1].dashed))errors.push('Multiple mathematical curves require labels and different line styles');
  }
  const v=s.validation;
  if(!v||!['pending','validated'].includes(v.status)||!validText(v.scope)||!validText(v.reasoning)||!/^\d{4}-\d{2}-\d{2}$/.test(v.checkedAt)||!Array.isArray(v.checks))errors.push('Missing validation evidence');
  else for(const c of v.checks){
    if(!Array.isArray(c.operands)||c.operands.length<2||c.operands.some(n=>!Number.isFinite(n))||(['quotient','difference','power'].includes(c.operation)&&c.operands.length!==2)||!Number.isFinite(c.expected)||!Number.isFinite(recomputeCheck(c))||Math.abs(recomputeCheck(c)-c.expected)>1e-9*Math.max(Number.MIN_VALUE,Math.abs(c.expected),Math.abs(recomputeCheck(c))))errors.push('Independent numerical check failed');
    if(!validText(c.evidence)||!summaryText(s).includes(c.evidence))errors.push('Numerical evidence must appear in displayed content');
  }
  if(s.status==='published'&&(v?.status!=='validated'||!v.contentHash?.match(/^[a-f0-9]{64}$/)))errors.push('Published summaries require validation and a sealed revision');
  return errors;
}
