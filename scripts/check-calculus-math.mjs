// Independent recomputation pass; does not generate questions or overwrite keys.
// Numerical checks use separately reviewed prompt data and actual answer choices. Concept checks
// bind separately recorded reasoning to the current semantic question hash.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {practiceFigures} from '../src/lib/practice-figures.ts';
export function figureLimit(figure,target,side='both') {
  function one(direction) {
    const values=[];
    for(const curve of figure.curves) for(let i=1;i<curve.points.length;i++) {
      const [x1,y1]=curve.points[i-1],[x2,y2]=curve.points[i];
      if(direction==='left'?x1<target&&target<=x2:x1<=target&&target<x2) values.push(target===x1?y1:target===x2?y2:y1+(target-x1)*(y2-y1)/(x2-x1));
    }
    if(!values.length || values.some(value=>Math.abs(value-values[0])>1e-9)) return 'DNE';
    return values[0];
  }
  if(side!=='both') return one(side);
  const left=one('left'),right=one('right');
  return typeof left==='number' && typeof right==='number' && Math.abs(left-right)<1e-9?left:'DNE';
}
export function verifyCalculusQuestion(question, review) {
  assert.equal(review.questionId,question.id);
  assert.equal(review.optionReview.length,4);
  assert.ok(review.optionReview.every(text=>typeof text==='string' && text.length>=20));
  assert.ok(review.independentReasoning.length>=60);
  const answer=question.options[question.correctIndex];
  if (review.check.type.startsWith('figure-')) {
    const figure=practiceFigures[question.id];assert.ok(figure,'Missing original graph: '+question.id);
    assert.equal(createHash('sha256').update(JSON.stringify(figure)).digest('hex'),review.check.figureSha256,'Graph changed after review: '+question.id);
    const actual=question.options.map(option=>option.startsWith('Does not exist')?'DNE':Number.parseFloat(option.replace('−','-')));
    let matches;
    if(review.check.type==='figure-limit-location') matches=actual.map(target=>typeof target==='number'&&Number.isFinite(target)&&typeof figureLimit(figure,target)==='number');
    else {
      const target=review.check.inputX+(review.check.inputShift||0);
      const limit=figureLimit(figure,target,review.check.side);
      const result=typeof limit==='number'?limit*(review.check.outputScale??1):limit;
      matches=actual.map(value=>typeof result==='number'?typeof value==='number'&&Math.abs(value-result)<1e-9:value===result);
    }
    assert.equal(matches.filter(Boolean).length,1,question.id+' unique graph-based result');
    assert.equal(matches.indexOf(true),question.correctIndex,question.id+' graph key mismatch');
  } else if (review.check.type==='numeric') {
    const inputs=review.check.inputs;
    // Inputs are separately transcribed from the prompt. Every literal must occur
    // in it, so changing a prompt requires a new review/check rather than stale QA.
    for (const input of inputs.filter(value=>Math.abs(value)>1)) assert.ok(question.prompt.replaceAll('−','-').includes(String(Math.abs(input))),question.id+' numeric input missing from prompt');
    const operations={
      'secant':([a,fa,b,fb])=>(fb-fa)/(b-a),
      'ratio':([change,interval])=>change/interval,
      'quadratic-rate':([quadratic,linear,t])=>2*quadratic*t+linear,
      'line-slope':([x1,y1,x2,y2])=>(y2-y1)/(x2-x1),
    };
    assert.ok(operations[review.check.operation],question.id+' unknown numerical check');
    const expected=operations[review.check.operation](inputs);
    const options=question.options.map(text=>Number.parseFloat(text.replace('−','-')));
    const matches=options.map(value=>Number.isFinite(value) && Math.abs(value-expected)<1e-10);
    assert.equal(matches.filter(Boolean).length,1,question.id+' must have one numerical answer');
    assert.equal(matches.indexOf(true),question.correctIndex,question.id+' numerical key mismatch');
  } else {
    assert.equal(review.check.type,'reasoning');
    assert.equal(answer,review.check.expectedAnswer,question.id+' conceptual answer changed; re-review all options');
  }
}
if(process.argv[1]?.replaceAll('\\','/').endsWith('/check-calculus-math.mjs')) {
  import('./check-calculus-bank.mjs').then(({validateCalculusBank})=>{
    const result=validateCalculusBank();
    console.log(`MATH PASS: ${result.questions} questions have hash-bound option reviews; ${result.numeric} numerical recomputations, ${result.questions-result.numeric} separately recorded reasoning checks. These are automated/assistant checks, not independent human review.`);
  }).catch(error=>{console.error(error);process.exitCode=1;});
}
