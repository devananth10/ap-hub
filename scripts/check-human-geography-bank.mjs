import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync,readdirSync} from 'node:fs';
import {validateQuestionBatches} from '../src/lib/practice-bank.ts';
import {geographyStimuli,validateGeographyStimulus} from '../src/lib/geography-stimuli.ts';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
export const semanticHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function verifyGeographyQuestion(question,review,stimulus){
 assert.equal(review.questionSha256,semanticHash(question),'Question changed after review: '+question.id);
 assert.equal(question.options[question.correctIndex],review.correctOption,'Stale answer: '+question.id);
 assert.ok(review.independentReview.length>80,'Independent reasoning record required');
 if(stimulus){validateGeographyStimulus(stimulus);assert.equal(review.stimulusSha256,semanticHash(stimulus),'Stimulus changed after review');}
 else assert.ok(!review.stimulusSha256,'Missing stimulus');
 let result;
 switch(review.check.type){
  case 'district-density':{assert.equal(stimulus.kind,'map');const value=id=>stimulus.regions.find(r=>r.label===id).value;result=(value('NW')+value('SW'))/2>(value('NE')+value('SE'))/2;assert.equal(value('NW')+value('NE'),value('SW')+value('SE'));assert.equal(result,true);assert.equal(question.correctIndex,1);break;}
  case 'dot-count':{const nw=stimulus.dots.filter(p=>p.x<50&&p.y<30).length,se=stimulus.dots.filter(p=>p.x>50&&p.y>30).length;assert.equal(nw,12);assert.equal(se,3);assert.equal(nw+se,stimulus.dots.length);assert.equal(question.correctIndex,3);break;}
  case 'contour-spacing':{const west=stimulus.paths.slice(0,3),east=stimulus.paths.slice(3);const gradient=paths=>(paths[2].value-paths[0].value)/((paths[2].points[0][0]-paths[0].points[0][0])*stimulus.kmPerUnit);assert.equal(gradient(west)/gradient(east),2);assert.equal(question.correctIndex,0);break;}
  case 'map-distance':{const a=stimulus.points.find(p=>p.label==='A'),b=stimulus.points.find(p=>p.label==='B');assert.equal(a.y,b.y);assert.ok(b.x>a.x);assert.equal(Math.hypot(b.x-a.x,b.y-a.y)*stimulus.kmPerUnit,120);assert.equal(question.correctIndex,2);break;}
  case 'circle-area':assert.equal(Math.sqrt(review.check.ratio),2);assert.equal(question.correctIndex,3);break;
  case 'sampling-coverage':{assert.equal(stimulus.kind,'chart');const residents=stimulus.series.find(s=>s.label==='Residents').values,users=stimulus.series.find(s=>s.label==='App users').values;assert.deepEqual(users.map((n,i)=>n/residents[i]),[.6,.6,.1]);assert.equal(question.correctIndex,0);break;}
  case 'regional-coverage':{assert.equal(stimulus.kind,'map');assert.ok(stimulus.regions.every(r=>r.value>=0&&r.value<=100));const value=id=>stimulus.regions.find(r=>r.label===id).value;assert.equal((value('NW')+value('NE'))/2,87.5);assert.equal((value('SW')+value('SE'))/2,12.5);assert.equal(question.correctIndex,3);break;}
  case 'clinic-budget':{const eligible=stimulus.rows.filter(row=>Number(row[1])<=100);const best=eligible.sort((a,b)=>Number(b[2])-Number(a[2]))[0];assert.equal(best[0],'R');assert.equal(eligible.filter(row=>Number(row[2])===Number(best[2])).length,1,'Ambiguous tied eligible sites');assert.equal(question.options[question.correctIndex],best[0]);break;}
  case 'flood-overlay':{const flood=stimulus.regions.find(r=>r.label==='Floodplain'),xs=flood.polygon.map(p=>p[0]),ys=flood.polygon.map(p=>p[1]);const inside=stimulus.points.filter(p=>p.x>Math.min(...xs)&&p.x<Math.max(...xs)&&p.y>Math.min(...ys)&&p.y<Math.max(...ys));assert.deepEqual(inside.map(p=>p.label),['B']);assert.equal(question.correctIndex,0);break;}
  case 'absolute-growth':{const old=stimulus.series.find(row=>row.label==='Earlier').values,now=stimulus.series.find(row=>row.label==='Later').values;assert.deepEqual(now.map((n,i)=>n-old[i]),[2000,1000,200]);assert.deepEqual(now.map((n,i)=>(n-old[i])/old[i]),[.5,1,.1]);assert.equal(question.correctIndex,3);break;}
  case 'comparison-changes':{assert.deepEqual(stimulus.rows.map(row=>Number(row[3])-Number(row[2])),[-3,-3]);assert.deepEqual(stimulus.rows.map(row=>row[1]),['Yes','No']);assert.equal(question.correctIndex,1);break;}
  case 'linear-arrangement':{assert.equal(stimulus.mapType,'dot');assert.equal(stimulus.dots.length,5);assert.equal(new Set(stimulus.dots.map(p=>p.y)).size,1);assert.deepEqual(stimulus.dots.map(p=>p.x).sort((a,b)=>a-b),[20,35,50,65,80]);assert.equal(question.correctIndex,3);break;}
  case 'relative-access':{const p=stimulus.rows.find(row=>row[0]==='P'),q=stimulus.rows.find(row=>row[0]==='Q');assert.ok(Number(p[1])<Number(q[1]));assert.ok(Number(p[2])>Number(q[2]));assert.equal(question.correctIndex,1);break;}
  case 'distance-decay':{const distances=stimulus.categories.map(Number.parseFloat),values=stimulus.series[0].values;assert.deepEqual(distances,[5,15,25]);assert.ok(values.every((value,i)=>value>0&&(!i||value<values[i-1])));assert.equal(question.correctIndex,0);break;}
  case 'spatial-association':{const rows=[...stimulus.rows].sort((a,b)=>Number(a[1])-Number(b[1]));assert.deepEqual(rows.map(row=>Number(row[1])),[0,5,10]);assert.deepEqual(rows.map(row=>Number(row[2])),[4,20,40]);assert.equal(question.correctIndex,2);break;}
  case 'aquifer-balance':{const value=label=>Number(stimulus.rows.find(row=>row[0]===label)[1]);assert.equal(value('Recharge')-value('Proposed withdrawal'),-40);assert.equal(value('Recharge')-value('Current withdrawal'),10);assert.equal(question.correctIndex,2);break;}
  case 'land-cover-balance':{const early=stimulus.series.find(s=>s.label==='Earlier').values,later=stimulus.series.find(s=>s.label==='Later').values;assert.equal(early.reduce((a,b)=>a+b,0),100);assert.equal(later.reduce((a,b)=>a+b,0),100);assert.deepEqual(later.map((n,i)=>n-early[i]),[-30,10,20]);assert.equal(question.correctIndex,3);break;}
  case 'upstream-land-use':{const river=stimulus.paths.find(p=>p.label==='River');assert.equal(river.arrow,true);assert.deepEqual(river.points,[[10,45],[90,45]]);assert.equal(stimulus.regions.find(r=>r.label==='West').value,80);assert.equal(stimulus.regions.find(r=>r.label==='East').value,20);assert.equal(question.correctIndex,0);break;}
  case 'possibilism-comparison':{assert.ok(stimulus.rows.every(row=>row[1]==='500'));assert.deepEqual(stimulus.rows.map(row=>row[2]),['Yes','No']);assert.equal(new Set(stimulus.rows.map(row=>row[3])).size,2);assert.equal(question.correctIndex,1);break;}
  case 'nested-access':{const value=label=>stimulus.regions.find(r=>r.label===label).value;assert.equal(stimulus.regions.reduce((sum,r)=>sum+r.value,0)/4,50);assert.equal((value('NW')+value('NE'))/2,80);assert.equal((value('SW')+value('SE'))/2,20);assert.equal(question.correctIndex,1);break;}
  case 'regional-weighting':{const totals=stimulus.rows.reduce((sum,row)=>[sum[0]+Number(row[1]),sum[1]+Number(row[2])],[0,0]);assert.deepEqual(totals,[1000,820]);assert.equal(totals[1]/totals[0],.82);assert.equal(question.correctIndex,2);break;}
  case 'aggregation-plans':{const local=review.check.localRates,groups=review.check.groups;assert.deepEqual(local,{A:80,B:80,C:20,D:20});groups.forEach((plan,i)=>{assert.deepEqual([...plan.flat()].sort(),Object.keys(local).sort());const expected=plan.map(group=>group.reduce((sum,key)=>sum+local[key],0)/group.length);assert.deepEqual(stimulus.series[i].values,expected);});assert.equal(question.correctIndex,0);break;}
  case 'cross-scale-ordering':{const [a,b]=stimulus.rows;assert.ok(Number(a[1])<Number(b[1]));assert.ok(Number(a[2])>Number(b[2]));assert.equal(question.correctIndex,3);break;}
  case 'formal-threshold':{assert.deepEqual(stimulus.regions.filter(r=>r.value>=60).map(r=>r.label),['NW','NE']);assert.equal(stimulus.regions.find(r=>r.label==='NE').value,60);assert.equal(question.correctIndex,3);break;}
  case 'service-region':{assert.deepEqual(stimulus.edges.map(e=>[e.from,e.to,e.label]),[['Town A','Clinic','300 trips'],['Town B','Clinic','150 trips']]);assert.equal(question.correctIndex,1);break;}
  case 'perceptual-inclusion':{assert.ok(stimulus.rows.every(row=>row[1]==='100'));assert.deepEqual(stimulus.rows.map(row=>Number(row[2])),[90,55,20]);assert.ok(stimulus.rows.every(row=>Number(row[2])>0&&Number(row[2])<100));assert.equal(question.correctIndex,2);break;}
  case 'overlapping-regions':{const wet=stimulus.rows.filter(row=>Number(row[1])>=800).map(row=>row[0]),service=stimulus.rows.filter(row=>Number(row[2])>50).map(row=>row[0]);assert.deepEqual(wet,['A','B']);assert.deepEqual(service,['B','C']);assert.deepEqual(wet.filter(label=>service.includes(label)),['B']);assert.equal(question.correctIndex,0);break;}
  case 'reasoning':break;
  default:throw Error('Unknown verification model: '+review.check.type);
 }
}
export function validateHumanGeographyBank(){
 const inventory=read('content-drafts/human-geography/research/official-topics.json').inventory;
 const files=readdirSync('src/content/practice').filter(f=>/^human-geography-\d+-\d+\.json$/.test(f));
 const batches=validateQuestionBatches(files.map(f=>read('src/content/practice/'+f)));
 const prompts=new Set(),topics=new Set(),ids=new Set(),visualCounts={};let total=0,stimulusCount=0,modelChecks=0;
 const rows=[];
 for(const batch of batches){
  assert.equal(batch.courseId,'human-geography');const topic=inventory.find(t=>t.topicId===batch.topicId);assert.ok(topic);assert.ok(!topics.has(topic.topicId));topics.add(topic.topicId);
  const qa=read(`content-drafts/human-geography/qa/topic-${topic.topicNumber.replace('.','-')}.json`);assert.equal(qa.status,'passed');assert.equal(qa.humanReviewPerformed,false);assert.equal(qa.semanticSha256,semanticHash(batch));assert.equal(qa.questions.length,11);assert.ok(qa.scopeReview&&qa.varietyReview&&qa.repetitionReview);
  const keys=new Set();
  batch.questions.forEach((question,i)=>{assert.equal(question.id,`hug-${topic.topicNumber.replace('.','-')}-${String(i+1).padStart(3,'0')}`);ids.add(question.id);const normalized=question.prompt.normalize('NFKC').replace(/\s+/g,' ').trim();assert.ok(!prompts.has(normalized),'Duplicate prompt');prompts.add(normalized);
   for(const letter of ['A','B','C','D'])assert.ok(question.explanation.includes(letter+':'),question.id+' needs all option explanations');assert.ok(question.explanation.length>350);assert.ok(!/https?:\/\/|\$\$|\\frac/.test(question.prompt+question.options.join('')));
   const review=qa.questions.find(r=>r.questionId===question.id);assert.ok(review);assert.ok(['Concepts and Processes','Spatial Relationships','Data Analysis','Source Analysis','Scale Analysis'].includes(review.skill));assert.ok(['foundational','intermediate','challenging'].includes(review.difficulty));const stimulus=geographyStimuli[question.id];verifyGeographyQuestion(question,review,stimulus);if(stimulus){stimulusCount++;visualCounts[stimulus.kind==='map'?`map:${stimulus.mapType}`:stimulus.kind]=(visualCounts[stimulus.kind==='map'?`map:${stimulus.mapType}`:stimulus.kind]||0)+1;}if(review.check.type!=='reasoning')modelChecks++;keys.add(question.correctIndex);total++;
  });assert.ok(keys.size>=3,'Vary answer positions');rows.push({topic:topic.topicNumber,topicId:topic.topicId,unitNumber:batch.unitNumber,questions:11});
 }
 for(const id of Object.keys(geographyStimuli))assert.ok(ids.has(id),'Orphan stimulus: '+id);
 rows.sort((a,b)=>a.unitNumber-b.unitNumber||Number(a.topic.split('.')[1])-Number(b.topic.split('.')[1]));
 return {officialTopics:68,targetQuestions:748,completedTopics:rows.length,questions:total,stimulusQuestions:stimulusCount,stimulusPercent:total?Math.round(stimulusCount/total*10000)/100:0,visualCounts,modelChecks,topics:rows,missing:inventory.filter(t=>!topics.has(t.topicId)).map(t=>t.topicNumber),withheldQuestionIds:[],humanReviewPerformed:false};
}
if(process.argv[1]?.replaceAll('\\','/').endsWith('/check-human-geography-bank.mjs'))console.log('HUMAN GEOGRAPHY BANK PASS',JSON.stringify(validateHumanGeographyBank()));
