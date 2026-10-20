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
