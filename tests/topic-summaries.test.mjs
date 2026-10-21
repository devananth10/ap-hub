import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';
import {courses} from '../src/lib/courses.ts';
import {topicSummaryCatalog,getTopicSummary,summaryHash} from '../src/lib/topic-summaries.ts';
import {validateTopicSummary,recomputeCheck} from '../src/lib/topic-summary-policy.ts';

const require=createRequire(import.meta.url);
const compiled=ts.transpileModule(fs.readFileSync('src/components/topic-summary.tsx','utf8'),{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText
 .replace("import { GeographyStimulus } from './geography-stimulus';",'const GeographyStimulus=()=>null;')
 .replace("import { SummaryMathFigure } from './summary-math-figure';",'const SummaryMathFigure=()=>null;')
 .replaceAll("'lucide-react'",JSON.stringify(pathToFileURL(require.resolve('lucide-react')).href))
 .replaceAll('"react/jsx-runtime"',JSON.stringify(pathToFileURL(require.resolve('react/jsx-runtime')).href))
 .replaceAll("'@/lib/topic-summary-policy'",JSON.stringify(new URL('../src/lib/topic-summary-policy.ts',import.meta.url).href));
const {TopicSummary}=await import('data:text/javascript;base64,'+Buffer.from(compiled).toString('base64'));
const figureCode=ts.transpileModule(fs.readFileSync('src/components/practice-figure.tsx','utf8'),{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText
 .replaceAll('"react"',JSON.stringify(pathToFileURL(require.resolve('react')).href))
 .replaceAll('"react/jsx-runtime"',JSON.stringify(pathToFileURL(require.resolve('react/jsx-runtime')).href))
 .replaceAll('"@/lib/practice-figures"',JSON.stringify(new URL('../src/lib/practice-figures.ts',import.meta.url).href));
const {PracticeFigure}=await import('data:text/javascript;base64,'+Buffer.from(figureCode).toString('base64'));

test('all available summaries have canonical IDs, distinct original text and sealed validated publication',()=>{
 const keys=new Set();
 for(const s of topicSummaryCatalog){assert.deepEqual(validateTopicSummary(s,courses),[],s.courseId+s.topicNumber);assert.equal(summaryHash(s),s.validation.contentHash);assert.equal(getTopicSummary(s.courseId,s.topicId),s);const key=s.courseId+'/'+s.topicId;assert.ok(!keys.has(key));keys.add(key);}
 assert.equal(courses.filter(c=>['chemistry','calculus-ab','human-geography'].includes(c.id)).flatMap(c=>c.units.flatMap(u=>u.topics)).length,240);
 assert.equal(getTopicSummary('chemistry','nonexistent'),undefined);
});
test('summary policy rejects bad mappings, incomplete content, misleading claims and false calculations',()=>{
 const original=topicSummaryCatalog[0];assert.ok(original,'At least one complete original summary');
 const copy=()=>structuredClone(original);
 let s=copy();s.topicId='wrong';assert.ok(validateTopicSummary(s,courses).length);
 s=copy();s.keyConcepts=[];assert.ok(validateTopicSummary(s,courses).length);
 s=copy();s.overview='This video was analyzed by live AI.';assert.ok(validateTopicSummary(s,courses).length);
 s=copy();s.validation.checks=[{operation:'quotient',operands:[8,2],expected:5,evidence:'nonsense'}];assert.ok(validateTopicSummary(s,courses).some(e=>e.includes('numerical')));
 s=copy();s.validation.checks=[{operation:'product',operands:[6.626e-34,5e14],expected:0,evidence:s.example.steps[0]}];assert.ok(validateTopicSummary(s,courses).some(e=>e.includes('numerical')),'Small photon energies must not be accepted as zero by an absolute tolerance');
 s=copy();s.validation.status='pending';assert.ok(validateTopicSummary(s,courses).length);
 s=copy();s.validation.contentHash='';assert.ok(validateTopicSummary(s,courses).length);
 assert.equal(recomputeCheck({operation:'quotient',operands:[8,2]}),4);
});
test('published gate withholds stale content, pending revisions, duplicate identities and draft entries',()=>{
 const s=topicSummaryCatalog[0],saved=structuredClone(s);
 try{
 s.status='draft';assert.equal(getTopicSummary(s.courseId,s.topicId),undefined);Object.assign(s,structuredClone(saved));
 s.validation.status='pending';assert.equal(getTopicSummary(s.courseId,s.topicId),undefined);Object.assign(s,structuredClone(saved));
 s.overview+=' Edited.';assert.equal(getTopicSummary(s.courseId,s.topicId),undefined);Object.assign(s,structuredClone(saved));
 topicSummaryCatalog.push(s);assert.equal(getTopicSummary(s.courseId,s.topicId),undefined);topicSummaryCatalog.pop();
 }finally{Object.assign(s,saved);if(topicSummaryCatalog.at(-1)===s&&topicSummaryCatalog.length>1)topicSummaryCatalog.pop();}
});
test('summary integration does not fetch live content, replace the player or change storage',()=>{
 const workspace=fs.readFileSync('src/components/study-workspace.tsx','utf8'),component=fs.readFileSync('src/components/topic-summary.tsx','utf8'),route=fs.readFileSync('src/app/courses/[courseId]/[topicId]/page.tsx','utf8');
 assert.ok(workspace.includes('aria-controls="topic-summary"'));assert.ok(!workspace.includes('Quick AI summary'));
 assert.ok(route.includes('summary={getTopicSummary(courseId, topicId)}'));
 assert.ok(workspace.indexOf('<VideoLessons')<workspace.indexOf('{summaryOpen && <TopicSummary'));
 assert.ok(!/fetch\(|localStorage|sessionStorage|iframe|dangerouslySetInnerHTML/.test(component));
 assert.ok(component.includes('being prepared and checked'));assert.ok(component.includes('No video analysis or live AI generation'));
});
test('shared renderer shows every original example, table headers and honest missing-summary state',()=>{
 for(const s of topicSummaryCatalog){
  const html=renderToStaticMarkup(createElement(TopicSummary,{summary:s,onClose:()=>{}}));
  assert.ok(html.includes('Worked example')&&html.includes('Common misconception')&&html.includes('Apply it on the AP exam'));
  assert.ok(html.includes('No video analysis or live AI generation'));
  if(s.table)assert.ok(html.includes('scope="col"')&&html.includes('scope="row"'));
 }
 const html=renderToStaticMarkup(createElement(TopicSummary,{onClose:()=>{}}));assert.ok(html.includes('being prepared and checked'));assert.ok(!html.includes('Worked example'));
});
test('original summary graphs preserve analytical values, non-color curve labels and bounded geometry',()=>{
 const cubic=getTopicSummary('calculus-ab','topic-5-6'),pair=getTopicSummary('calculus-ab','topic-5-8');assert.ok(cubic?.mathFigure&&pair?.mathFigure);
 for(const [x,y] of cubic.mathFigure.curves[0].points)assert.ok(Math.abs(y-x**3)<1e-9);
 for(const [x,y] of pair.mathFigure.curves[0].points)assert.ok(Math.abs(y-x*x)<1e-9);
 for(const [x,y] of pair.mathFigure.curves[1].points)assert.equal(y,2*x);
 const html=renderToStaticMarkup(createElement(PracticeFigure,{questionId:'summary-function-pair',figure:pair.mathFigure}));
 assert.ok(html.includes('stroke-dasharray="6 4"')&&html.includes('Graph curves')&&html.includes('dashed')&&html.includes('solid'));
 assert.ok(html.includes('role="img"')&&html.includes('<desc'));
 const invalid=structuredClone(pair);invalid.mathFigure.curves[0].points[0][1]=999;
 assert.ok(validateTopicSummary(invalid,courses).some(e=>e.includes('mathematical')));
 const accumulation=getTopicSummary('calculus-ab','topic-6-5');assert.ok(accumulation?.mathFigure);
 for(const [x,y] of accumulation.mathFigure.curves[0].points)assert.ok(Math.abs(y-(x*x/2-2*x))<1e-9);
 for(const [x,y] of accumulation.mathFigure.curves[1].points)assert.equal(y,x-2);
 const field=getTopicSummary('calculus-ab','topic-7-3');assert.ok(field?.mathFigure?.slopeField?.length===25);
 for(const p of field.mathFigure.slopeField)assert.equal(p.slope,p.x-p.y);
 const badField=structuredClone(field);badField.mathFigure.slopeField[0].slope=Infinity;
 assert.ok(validateTopicSummary(badField,courses).some(e=>e.includes('slope field')));
});
