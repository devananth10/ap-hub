import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {geographyStimuli,validateGeographyStimulus,mapBin,symbolRadius} from '../src/lib/geography-stimuli.ts';
import {validateHumanGeographyBank,verifyGeographyQuestion,semanticHash} from '../scripts/check-human-geography-bank.mjs';
const require=createRequire(import.meta.url);
const compiled=ts.transpileModule(readFileSync('src/components/geography-stimulus.tsx','utf8'),{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText
 .replace('import { Dialog } from "./ui";','const Dialog=()=>null;')
 .replaceAll('"react"',JSON.stringify(pathToFileURL(require.resolve('react')).href))
 .replaceAll('"react/jsx-runtime"',JSON.stringify(pathToFileURL(require.resolve('react/jsx-runtime')).href))
 .replaceAll('"@/lib/geography-stimuli"',JSON.stringify(new URL('../src/lib/geography-stimuli.ts',import.meta.url).href));
const {StimulusContent,GeographyStimulus}=await import('data:text/javascript;base64,'+Buffer.from(compiled).toString('base64'));
const render=stimulus=>renderToStaticMarkup(createElement(StimulusContent,{stimulus}));
test('optional map label anchors preserve old defaults and reject invalid coordinates',()=>{
 const s=structuredClone(geographyStimuli['hug-1-1-001']);s.regions[0].labelPoint=[18,12];validateGeographyStimulus(s);assert.ok(render(s).includes(`x="${40+18*3.8}" y="${35+12*3.3}" text-anchor="middle">NW: 80`));
 for(const point of [[-1,12],[18,61],[NaN,12],[18],[18,12,5]]){s.regions[0].labelPoint=point;assert.throws(()=>validateGeographyStimulus(s),/label position/);}
});
test('origin evidence rejects reversed transfers, displaced hearths, altered dates and adoption totals',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-5-3.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-5-3.json','utf8'));
 for(const [i,change] of [[0,s=>s.points[1].x=20],[1,s=>s.paths[0].points.reverse()],[2,s=>s.rows[0][1]='3000'],[3,s=>s.series[1].values[2]=80]]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
});
test('second-revolution evidence checks denominators, relative indices, actual strip geometry and trial results',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-5-4.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-5-4.json','utf8'));
 for(const [i,change] of [[0,s=>s.rows[1][3]='60'],[1,s=>s.series[1].values[1]=150],[2,s=>s.regions[1].polygon[0][0]=5],[3,s=>s.rows[1][2]='600']]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
});
test('Green Revolution checks preserve treatment interaction, access, aggregate irrigation and whole-cost returns',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-5-5.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-5-5.json','utf8'));
 for(const [i,change] of [[0,s=>s.rows[1][2]='2.2'],[1,s=>s.regions[0].value=25],[2,s=>s.series[0].values[1]=50],[3,s=>s.rows[1][3]='200']]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
 const r=structuredClone(qa.questions[8]);r.check.yields[1]=2;assert.throws(()=>verifyGeographyQuestion(batch.questions[8],r));
});
test('production-region checks retain output destinations, rent viability, crop shares and field sequences',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-5-6.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-5-6.json','utf8'));
 for(const [i,change] of [[0,s=>s.rows[0][3]='1600'],[1,s=>s.series[0].values[1]=1000],[2,s=>s.regions[0].value=20],[3,s=>s.rows[1][2]='Maize']]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
});
test('organization checks retain chain stages, fixed-cost allocation, land totals and stage-specific returns',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-5-7.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-5-7.json','utf8'));
 for(const [i,change] of [[0,s=>s.edges[1].to='Shop'],[1,s=>s.rows[1][2]='20'],[2,s=>s.rows[3][2]='200'],[3,s=>s.rows[3][2]='2000']]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
});
test('von Thunen checks retain centered ring order, true rent curves, route rates and competing markets',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-5-8.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-5-8.json','utf8'));
 for(const [i,change] of [[0,s=>s.rings[0].radius=27],[1,s=>s.series[0].values[1]=500],[2,s=>s.paths[1].points.reverse()],[3,s=>s.rows[1][2]='100']]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
 const r=structuredClone(qa.questions[8]);r.check.slopes[0]=50;assert.throws(()=>verifyGeographyQuestion(batch.questions[8],r));
 const html=render(geographyStimuli['hug-5-8-001']);assert.match(html,/cx="230" cy="134" r="92.39999999999999"/);assert.ok(html.includes('>IV</text>'));
});
const base={title:'TEST ONLY',description:'Original hypothetical test data; not a published question.',caption:'TEST ONLY',hypothetical:true,attribution:'Original PrepAtlas schematic and synthetic data'};
const chart={...base,kind:'chart',unitLabel:'People (thousands)',categories:['A','B'],series:[{label:'Year 1',values:[25,50]},{label:'Year 2',values:[50,75]}],max:100};
const pyramid={...base,kind:'pyramid',unitLabel:'People (thousands)',max:100,cohorts:[{label:'0–14',ageStart:0,ageEnd:14,male:50,female:50},{label:'15–64',ageStart:15,ageEnd:64,male:75,female:75},{label:'65+',ageStart:65,ageEnd:null,male:25,female:25}]};

test('present geography sets have eleven reviewed questions, unique IDs and genuine stimulus coverage',()=>{
 const result=validateHumanGeographyBank();assert.ok(result.questions>=11);assert.equal(result.questions,result.completedTopics*11);assert.ok(result.stimulusQuestions>=4);assert.equal(result.humanReviewPerformed,false);
});
test('each original stimulus renders its evidence, accessible description and enlargement',()=>{
 for(const [questionId,stimulus] of Object.entries(geographyStimuli)){
  validateGeographyStimulus(stimulus);const html=render(stimulus);if(stimulus.kind==='table'){assert.match(html,/<table>/);assert.match(html,/scope="col"/);}else{assert.match(html,/role="img"/);assert.match(html,/<desc/);}assert.ok(html.includes('Hypothetical')||html.includes('hypothetical'));
  const wrapper=renderToStaticMarkup(createElement(GeographyStimulus,{questionId}));assert.ok(wrapper.includes('Enlarge '+stimulus.title));assert.ok(!wrapper.includes('<dialog'));
 }
 const html=render(geographyStimuli['hug-1-1-001']);assert.match(html,/data-region="NW" data-value="80" data-bin="1"/);assert.match(html,/data-region="NE" data-value="20" data-bin="0"/);assert.ok(html.includes('NW: 80'));assert.equal(mapBin(50,geographyStimuli['hug-1-1-001'].bins),1);
 assert.equal((render(geographyStimuli['hug-1-1-002']).match(/class="geo-dot"/g)||[]).length,15);
 const scale=render(geographyStimuli['hug-1-1-004']);assert.ok(scale.includes('40 km'));assert.ok(scale.includes('Town locations'));
 assert.ok(scale.includes('geo-region-label-unshaded'));assert.ok(!html.includes('geo-region-label-unshaded'));
});
test('chart bar heights, zero baseline, labels and equivalent data match numeric inputs',()=>{
 validateGeographyStimulus(chart);const html=render(chart);assert.match(html,/data-value="50" x="[^"]+" y="135" width="[^"]+" height="85"/);assert.ok(html.includes('A: Year 1'));assert.ok(html.includes('B: Year 2'));assert.ok(html.includes('<table>'));assert.match(html,/<td>75<\/td>/);
 const wrong=structuredClone(chart);wrong.series[0].values[0]=101;assert.throws(()=>validateGeographyStimulus(wrong),/outside axis/);
});

test('line charts plot actual values with distinct patterns/markers and retain equivalent data',()=>{
 const lines={...chart,display:'line'};validateGeographyStimulus(lines);const html=render(lines);assert.match(html,/data-series="Year 1" points="80,177.5 440,135"/);assert.match(html,/stroke-dasharray="7 4"/);assert.ok(html.includes('solid / circles'));assert.ok(html.includes('dashed / squares'));assert.match(html,/<td>75<\/td>/);
 const invalid={...lines,categories:['Only'],series:[{label:'A',values:[25]}]};assert.throws(()=>validateGeographyStimulus(invalid),/line categories/);
 assert.match(html,/data-value="25".*?<text x="80" y="196.5"/);assert.match(html,/data-value="50".*?<text x="80" y="124"/);
 assert.throws(()=>validateGeographyStimulus({...lines,series:[...lines.series,{label:'Third',values:[10,20]}]}),/at most two/);
});
test('population pyramids place oldest cohorts at top with symmetric side scales and complete data',()=>{
 validateGeographyStimulus(pyramid);const html=render(pyramid);assert.ok(html.indexOf('data-cohort="65+"')<html.indexOf('data-cohort="0–14"'));assert.match(html,/data-side="male" data-value="50" x="150" y="105" width="70"/);assert.match(html,/data-side="female" data-value="50" x="260" y="105" width="70"/);assert.ok(html.includes('each side uses the same scale'));assert.ok(html.includes('<table>'));
 const wrong=structuredClone(pyramid);wrong.cohorts.reverse();assert.throws(()=>validateGeographyStimulus(wrong),/cohort/);
});
test('flow arrows, proportional area and model edges use their supplied directions and explicit assumptions',()=>{
 const region={label:'R',polygon:[[0,0],[100,0],[100,60],[0,60]]};
 const flow={...base,kind:'map',mapType:'flow',unitLabel:'Migrants',regions:[region],paths:[{label:'A to B',points:[[10,10],[80,50]],arrow:true,value:500}]};validateGeographyStimulus(flow);const html=render(flow);assert.match(html,/data-arrow-end="true"/);assert.ok(html.includes('78,68 344,200'));assert.ok(html.includes('marker-end='));
 const wrong=structuredClone(flow);wrong.paths[0].arrow=false;assert.throws(()=>validateGeographyStimulus(wrong),/direction/);
 assert.equal(symbolRadius(4,4)/symbolRadius(1,4),2);
 const model={...base,kind:'model',assumptions:'Hypothetical two-node model; arrows represent goods, not people.',nodes:[{label:'Core',x:20,y:20},{label:'Periphery',x:80,y:40}],edges:[{from:'Periphery',to:'Core',label:'Raw materials'}]};validateGeographyStimulus(model);const output=render(model);assert.ok(output.includes('Assumptions:'));assert.ok(output.includes('Raw materials'));
 const invalid=structuredClone(model);invalid.edges[0].to='Unknown';assert.throws(()=>validateGeographyStimulus(invalid));
});
test('legend gaps, bad provenance, off-map points, stale answers and altered visual calculations are rejected',()=>{
 const original=geographyStimuli['hug-1-1-001'];for(const change of [s=>s.bins[1].min=60,s=>s.regions[0].value=1000,s=>s.hypothetical=false,s=>s.regions[0].polygon[0][0]=-1]){const s=structuredClone(original);change(s);assert.throws(()=>validateGeographyStimulus(s));}
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-1-1.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-1-1.json','utf8'));const q=batch.questions[3],review=qa.questions[3],s=structuredClone(geographyStimuli[q.id]);s.points[1].x=70;const updated={...review,stimulusSha256:semanticHash(s)};assert.throws(()=>verifyGeographyQuestion(q,updated,s));const changed={...q,correctIndex:0};assert.throws(()=>verifyGeographyQuestion(changed,review,geographyStimuli[q.id]));
});
test('sampling-coverage verification recomputes participation ratios independently of bar counts alone',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-1-2.json','utf8'));
 const qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-1-2.json','utf8'));const q=batch.questions[1],review=qa.questions[1],s=structuredClone(geographyStimuli[q.id]);s.series.find(row=>row.label==='App users').values[2]=1000;
 assert.throws(()=>verifyGeographyQuestion(q,{...review,stimulusSha256:semanticHash(s)},s));
});
test('planning decisions reject budget/coverage ties and altered population changes even with refreshed data hashes',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-1-3.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-1-3.json','utf8'));
 const tied=structuredClone(geographyStimuli[batch.questions[0].id]);tied.rows.find(row=>row[0]==='T')[2]='3000';assert.throws(()=>verifyGeographyQuestion(batch.questions[0],{...qa.questions[0],stimulusSha256:semanticHash(tied)},tied),/tied/);
 const changed=structuredClone(geographyStimuli[batch.questions[2].id]);changed.series.find(s=>s.label==='Later').values[0]=4500;assert.throws(()=>verifyGeographyQuestion(batch.questions[2],{...qa.questions[2],stimulusSha256:semanticHash(changed)},changed));
});

test('spatial-concept models reject misaligned points, reversed accessibility and broken distance decay',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-1-4.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-1-4.json','utf8'));
 for(const [i,change] of [[0,s=>s.dots[2].y=25],[1,s=>s.rows[0][2]='10'],[2,s=>s.series[0].values[1]=80]]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
});

test('human-environment checks preserve resource balance, fixed land area and actual river-arrow direction',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-1-5.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-1-5.json','utf8'));
 for(const [i,change] of [[0,s=>s.rows[2][1]='80'],[1,s=>s.series[1].values[0]=70],[2,s=>s.paths[0].points.reverse()]]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
 const html=render(geographyStimuli[batch.questions[2].id]);assert.match(html,/data-path="River" data-arrow-end="true" points="78,183.5 382,183.5"/);
 assert.match(html,/class="geo-path geo-path-on-fill"/);assert.match(html,/class="geo-path-halo"/);assert.match(html,/fill="#152c27" stroke="#f3f9f6"/);
});

test('scale-analysis checks recompute weighted totals and aggregation plans from unchanged local rates',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-1-6.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-1-6.json','utf8'));
 for(const [i,change] of [[1,s=>s.rows[1][1]='900'],[2,s=>s.series[1].values[0]=60],[3,s=>s.rows[0][2]='900']]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
});

test('regional models retain inclusive thresholds, directed service links and overlapping membership',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-1-7.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-1-7.json','utf8'));
 for(const [i,change] of [[0,s=>s.regions[1].value=59],[1,s=>s.edges[0]={from:'Clinic',to:'Town A',label:'300 trips'}],[3,s=>s.rows[1][2]='50']]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
 const html=render(geographyStimuli[batch.questions[1].id]);assert.ok(html.includes('x1="97" y1="74.6" x2="230" y2="183.5"'));assert.ok(html.includes('300 trips'));assert.ok(html.includes('150 trips'));
});

test('population distribution checks distinguish three land denominators and reject changed corridor evidence',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-2-1.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-2-1.json','utf8'));
 for(const [i,change] of [[0,s=>s.rows[2][1]='600'],[1,s=>s.rows[1][3]='50'],[2,s=>s.dots[0].x=10]]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
});

test('population-consequence checks distinguish travel access, per-person use and total demand',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-2-2.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-2-2.json','utf8'));
 for(const [i,change] of [[0,s=>s.rows[1][2]='2'],[1,s=>s.series[0].values.reverse()],[3,s=>s.rows[1][3]='100']]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
});

test('published composition models verify whole-population denominators, cohort totals and dependency ratios',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-2-3.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-2-3.json','utf8'));
 for(const [i,change] of [[0,s=>s.cohorts[0].male=9],[1,s=>{s.cohorts[2].male=6;s.cohorts[2].female=12;}],[2,s=>s.rows[1][1]='10000'],[3,s=>{s.cohorts[0].male+=1;s.cohorts[8].male-=1;}]]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
 const html=render(geographyStimuli[batch.questions[0].id]);assert.ok(html.indexOf('data-cohort="80+"')<html.indexOf('data-cohort="0–9"'));assert.match(html,/data-cohort="0–9" data-side="male" data-value="8"/);assert.match(html,/<th scope="row">10–19<\/th><td>7<\/td><td>7<\/td>/);
});

test('population dynamics checks preserve signed flows, rate conversion and constant-growth doubling assumptions',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-2-4.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-2-4.json','utf8'));
 for(const [i,change] of [[0,s=>s.rows[4][1]='500'],[1,s=>s.series[1].values[1]=15],[2,s=>s.rows[0][1]='0'],[3,s=>s.paths[0].points.reverse()]]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
 const html=render(geographyStimuli[batch.questions[3].id]);assert.match(html,/data-path="3000" data-arrow-end="true" points="116,94.4 344,94.4"/);assert.match(html,/data-path="500" data-arrow-end="true" points="344,173.6 116,173.6"/);
});

test('transition-model evidence verifies actual line coordinates, rate contrasts and cause-of-death totals',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-2-5.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-2-5.json','utf8'));
 for(const [i,change] of [[0,s=>s.series[1].values[1]=41],[2,s=>s.regions.forEach(r=>r.value=1.5)],[3,s=>{s.rows[1][1]='0';s.rows[1][3]='300';}]]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
 const html=render(geographyStimuli[batch.questions[0].id]);const points=html.match(/data-series="Births" points="([^"]+)"/)[1].split(' ').map(p=>p.split(',').map(Number));const expected=[[80,77.2],[200,84],[320,135],[440,186]];points.forEach((p,i)=>p.forEach((v,j)=>assert.ok(Math.abs(v-expected[i][j])<1e-9)));assert.ok(html.includes('dashed / squares'));assert.ok(html.includes('<td>42</td><td>40</td>'));
});

test('Malthusian models reject false crossings and supply totals; proportional symbols use area and clear labels',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-2-6.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-2-6.json','utf8'));
 for(const [i,change] of [[0,s=>s.series[0].values[2]=9],[1,s=>s.rows[1][3]='1000'],[2,s=>s.points[1].value=1],[3,s=>s.series[0].values[3]=16]]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
 const html=render(geographyStimuli[batch.questions[2].id]);const radii=[...html.matchAll(/data-point="[^"]+" data-value="([^"]+)"[^>]* r="([^"]+)"/g)].map(m=>Number(m[2]));assert.equal(radii.length,2);assert.ok(Math.abs((radii[0]/radii[1])**2-10)<1e-9);assert.ok(html.includes('y="56.5"'));assert.ok(html.includes('0.2 units/person'));
});

test('policy checks distinguish explicit aims, background trends, local access and admissions age shares',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-2-7.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-2-7.json','utf8'));
 for(const [i,change] of [[0,s=>s.rows[0][2]='Encourage births'],[1,s=>s.series[1].values[2]=3],[2,s=>s.regions[3].value=80],[3,s=>s.series[1].values[1]=800]]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
});

test('women and demographic-change checks retain aggregate scope, migration denominators and unpaid care',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-2-8.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-2-8.json','utf8'));
 for(const [i,change] of [[0,s=>s.rows[2][2]='90'],[1,s=>s.rows[1][1]='600'],[2,s=>s.rows[0][2]='0'],[3,s=>s.series[0].values[1]=80]]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
});

test('aging checks separate counts from shares and demographic ratios from contributor support',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-2-9.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-2-9.json','utf8'));
 for(const [i,change] of [[0,s=>s.rows[1][3]='2000'],[1,s=>s.series[1].values[0]=2500],[2,s=>s.points[1].value=250],[3,s=>s.rows[1][3]='3000']]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
});

test('migration-driver checks preserve intervening order, financing constraints and overlapping responses',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-2-10.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-2-10.json','utf8'));
 for(const [i,change] of [[0,s=>s.rows[1][2]='1000'],[1,s=>s.points[1].x=95],[2,s=>s.rows[1][2]='1000'],[3,s=>s.series[0].values[2]=0]]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
});

test('migration-type evidence preserves borders, pending status, residential sequences and seasonal totals',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-2-11.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-2-11.json','utf8'));
 for(const [i,change] of [[0,s=>s.paths[0].points[1][0]=60],[1,s=>s.rows[0][1]='Abroad; formal refugee recognition'],[2,s=>s.edges[0].to='City'],[3,s=>s.series[1].values[2]=20]]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
});

test('migration effects retain net receipts, mixed flow units, workforce signs and original cultural counts',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-2-12.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-2-12.json','utf8'));
 for(const [i,change] of [[0,s=>s.rows[1][2]='50'],[1,s=>s.paths[1].label='200k people'],[2,s=>s.rows[3][1]='0'],[3,s=>s.series[1].values[0]=4]]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
 const q=structuredClone(batch.questions[2]);q.options[1]='225; every emigrant is added.';assert.throws(()=>verifyGeographyQuestion(q,{...qa.questions[2],questionSha256:semanticHash(q)},geographyStimuli[q.id]));
});

test('culture evidence keeps learned practices distinct from rainfall and avoids universal trait inference',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-3-1.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-3-1.json','utf8'));
 for(const [i,change] of [[0,s=>s.rows[2][1]='A taught recipe'],[1,s=>s.regions[2].value=100],[2,s=>s.series[1].values[0]=40],[3,s=>s.rows[0][1]='I ask participants about meanings']]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
});

test('landscape checks retain historical layers, access-rule differences and seasonal use beyond buildings',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-3-2.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-3-2.json','utf8'));
 for(const [i,change] of [[0,s=>s.points[0].label='New factory only'],[1,s=>s.rows[1][1]='Unmodified rock'],[2,s=>s.series[0].values[0]=8],[3,s=>s.rows[3][1]='Many permanent houses']]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
});

test('cultural-pattern checks preserve complementary languages, crosscutting identities and shared institutions',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-3-3.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-3-3.json','utf8'));
 for(const [i,change] of [[0,s=>s.regions[2].value=0],[1,s=>s.rows[1][2]='80'],[2,s=>s.edges[1].from='R community'],[3,s=>s.points[0].x=25]]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
});

test('diffusion checks preserve contact timing, hierarchy links, adaptation and conserved relocation totals',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-3-4.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-3-4.json','utf8'));
 for(const [i,change] of [[0,s=>s.points[1].value=0],[1,s=>s.edges[2].from='Capital office'],[2,s=>s.rows[1][2]=s.rows[1][1]],[3,s=>s.rows[1][1]='100']]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
});

test('model labels can sit outside incoming and outgoing arrows with validated positions',()=>{
 const s=geographyStimuli['hug-3-4-002'],html=render(s);assert.match(html,/data-node-label="West hub" x="104" y="138" text-anchor="end"/);assert.match(html,/data-node-label="East hub" x="356" y="138" text-anchor="start"/);assert.match(html,/data-node-label="Capital office" x="230" y="39.5" text-anchor="middle"/);
 const changed=structuredClone(s);changed.nodes[0].labelPosition='diagonal';assert.throws(()=>validateGeographyStimulus(changed),/label position/);
});

test('historical diffusion checks distinguish interaction from distance, institutional persistence and language function',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-3-5.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-3-5.json','utf8'));
 for(const [i,change] of [[0,s=>s.points[1].value=5],[1,s=>s.rows[2][1]='Government removes L from those institutions'],[2,s=>s.rows[1][1]='Adults use only R and S'],[3,s=>s.series[0].values[2]=80]]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
});

test('contemporary diffusion checks preserve time conversions, network direction and separate media denominators',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-3-6.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-3-6.json','utf8'));
 for(const [i,change] of [[0,s=>s.series[0].values[2]=30],[1,s=>s.edges[2].from='Global audience'],[2,s=>s.rows[1][2]='80'],[3,s=>s.series[0].values[0]=0]]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
});

test('religion and language checks retain migration direction, classifications, denominator differences and conversion accounting',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-3-7.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-3-7.json','utf8'));
 for(const [i,change] of [[0,s=>s.paths[0].points.reverse()],[1,s=>s.rows[2][1]='Germanic'],[2,s=>s.categories.reverse()],[3,s=>s.rows[3][1]='60']]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
});

test('diffusion-effect checks preserve continuing practices, combined inputs, shared access and cohort changes',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-3-8.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-3-8.json','utf8'));
 for(const [i,change] of [[0,s=>s.rows[1][2]='0'],[1,s=>s.edges[1].to='R melody'],[2,s=>s.paths[1].points[2]=[82,12]],[3,s=>s.series[0].values[0]=5]]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
});

test('political-entity checks keep cross-border nations, external authority, identity shares and internal borders distinct',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-4-1.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-4-1.json','utf8'));
 for(const [i,change] of [[0,s=>s.dots[4].x=40],[1,s=>s.rows[1][2]='Independent external authority'],[2,s=>s.series[0].values[1]=0],[3,s=>s.regions[1].polygon[0][0]=40]]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
});

test('political-process checks preserve independent status, inherited borders, devolved fields and voting denominators',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-4-2.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-4-2.json','utf8'));
 for(const [i,change] of [[0,s=>s.rows[1][2]='External colonial power'],[1,s=>s.regions[1].polygon[0][0]=45],[2,s=>s.series[0].values[1]=10],[3,s=>s.rows[0][1]='800']]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
});

test('power checks recompute detours and permits and retain the supplied financial and rival-support mechanisms',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-4-3.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-4-3.json','utf8'));
 for(const [i,change] of [[0,s=>s.paths[0].value=600],[1,s=>s.rows[4][1]='Unconstrained alternatives'],[2,s=>s.edges[1].to='Faction R'],[3,s=>s.series[0].values[1]=60]]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
});

test('boundary checks retain coordinate placement, relative chronology, former function and cultural correspondence',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-4-4.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-4-4.json','utf8'));
 for(const [i,change] of [[0,s=>s.regions[1].polygon[0][0]=60],[1,s=>s.rows[2][0]='Before 1850'],[2,s=>s.description=s.description.replace('no longer governs','currently governs')],[3,s=>s.regions[1].value=80]]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
});

test('boundary-function checks separate tasks, baseline distances, overlap intervals and absolute versus relative waits',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-4-5.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-4-5.json','utf8'));
 for(const [i,change] of [[0,s=>s.rows[2][1]='Draw the agreed line'],[1,s=>s.points[1].label='B: 250 nmi'],[2,s=>s.paths[0].label='400 nmi'],[3,s=>s.series[1].values[0]=20]]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
});

test('district models recompute fixed-vote row/column seats, rounded shares and packing/cracking totals',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-4-6.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-4-6.json','utf8'));
 for(const [i,change] of [[0,s=>s.regions[3].value=80],[0,s=>s.regions[3].polygon[0][0]=5],[1,s=>s.rows[3][1]='140'],[2,s=>s.series[0].values[0]=33.3],[3,s=>s.regions[1].value=60]]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
});

test('governance checks retain delegated directions, protected powers, policy variation and multilevel centers',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-4-7.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-4-7.json','utf8'));
 for(const [i,change] of [[0,s=>s.edges[0].from='West office'],[1,s=>s.rows[1][2]='Permitted by the supplied rules'],[2,s=>s.regions[1].value=40],[3,s=>s.points.pop()]]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
});

test('devolution-factor checks preserve physical separation, balanced flows, cross-border claims and support changes',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-4-8.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-4-8.json','utf8'));
 for(const [i,change] of [[0,s=>s.points[1].x=20],[1,s=>s.rows[0][3]='80'],[2,s=>s.paths[0].points.reverse()],[3,s=>s.series[0].values[1]=25]]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
});

test('sovereignty checks retain territorial scale, multiple communication uses, downstream connections and distinct mandates',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-4-9.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-4-9.json','utf8'));
 for(const [i,change] of [[0,s=>s.rows[0][1]='Independent foreign states'],[1,s=>s.edges.pop()],[2,s=>s.paths[0].points.reverse()],[3,s=>s.rows[4][1]='Collective defense']]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
 const r=structuredClone(qa.questions[5]);r.check.shared=180;assert.throws(()=>verifyGeographyQuestion(batch.questions[5],r));
});

test('centripetal/centrifugal checks retain access gaps, subnational averages, distinct group responses and successor locations',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-4-10.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-4-10.json','utf8'));
 for(const [i,change] of [[0,s=>s.series[1].values[1]=180],[1,s=>s.regions[2].value=80],[2,s=>s.rows[1][2]='95'],[3,s=>s.dots[4].x=20]]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
});

test('agriculture checks preserve seasonal timing, land denominators, grazing directions and full fallow cycles',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-5-1.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-5-1.json','utf8'));
 for(const [i,change] of [[0,s=>s.series[0].values.reverse()],[1,s=>s.rows[1][1]='10'],[2,s=>s.paths[0].points.reverse()],[3,s=>s.rows[2][1]='6']]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
});

test('rural-settlement checks retain compact homes, common frontage, partial grid geometry and a matching creek boundary',()=>{
 const batch=JSON.parse(readFileSync('src/content/practice/human-geography-5-2.json','utf8')),qa=JSON.parse(readFileSync('content-drafts/human-geography/qa/topic-5-2.json','utf8'));
 for(const [i,change] of [[0,s=>s.dots[0].x=5],[1,s=>s.dots[1].y=20],[2,s=>s.regions[1].polygon[0][0]=10],[3,s=>s.paths[0].points[1][1]=30],[3,s=>s.regions[0].polygon.splice(3,1)]]){
  const s=structuredClone(geographyStimuli[batch.questions[i].id]);change(s);assert.throws(()=>verifyGeographyQuestion(batch.questions[i],{...qa.questions[i],stimulusSha256:semanticHash(s)},s));
 }
 const r=structuredClone(qa.questions[6]);r.check.a[1]=100;assert.throws(()=>verifyGeographyQuestion(batch.questions[6],r));
});
