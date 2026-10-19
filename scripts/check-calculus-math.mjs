// Independent recomputation pass; does not generate questions or overwrite keys.
// Numerical checks use separately reviewed prompt data and actual answer choices. Concept checks
// bind separately recorded reasoning to the current semantic question hash.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {practiceFigures} from '../src/lib/practice-figures.ts';
import {practiceTables} from '../src/lib/practice-tables.ts';
export function numericalOption(text) {
  const clean=text.replaceAll('−','-').trim();
  const fraction=clean.match(/^([+-]?\d+(?:\.\d+)?)\/([+-]?\d+(?:\.\d+)?)(?:$|\s+[A-Za-z])/);
  if(fraction) return Number(fraction[1])/Number(fraction[2]);
  const root=clean.match(/^([+-]?)√(\d+(?:\.\d+)?)$/);if(root) return (root[1]==='-'?-1:1)*Math.sqrt(Number(root[2]));
  const scalar=clean.match(/^([+-]?\d+(?:\.\d+)?)(?:$|\s+[A-Za-z°])/);if(scalar)return Number(scalar[1]);
  assert.ok(!/^[+\-\d√π.]/.test(clean),'Unsupported numerical expression needs an explicit verified parser: '+text);
  return NaN;
}
export function evaluateExpression(expression,x) {
  if(expression==='x') {assert.ok(Number.isFinite(x),'Missing numerical variable');return x;}
  if(expression==='pi') return Math.PI;
  if(typeof expression==='number') {assert.ok(Number.isFinite(expression));return expression;}
  assert.ok(Array.isArray(expression)&&expression.length>=2);
  const [operation,...children]=expression,values=children.map(child=>evaluateExpression(child,x));
  const operations={add:(...xs)=>xs.reduce((a,b)=>a+b,0),mul:(...xs)=>xs.reduce((a,b)=>a*b,1),sub:(a,b)=>a-b,div:(a,b)=>a/b,pow:(a,b)=>a**b,sqrt:Math.sqrt,abs:Math.abs,cbrt:Math.cbrt,sin:Math.sin,cos:Math.cos,tan:Math.tan,exp:Math.exp,ln:Math.log};
  assert.ok(operations[operation],'Unknown arithmetic expression operation');
  const expectedArity={sub:2,div:2,pow:2,sqrt:1,abs:1,cbrt:1,sin:1,cos:1,tan:1,exp:1,ln:1}[operation];
  assert.ok(expectedArity?values.length===expectedArity:values.length>=2,'Invalid arithmetic expression arity');
  const value=operations[operation](...values);assert.ok(Number.isFinite(value),'Invalid real arithmetic domain');return value;
}
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
  if(question.prompt.includes('table below')) assert.equal(createHash('sha256').update(JSON.stringify(practiceTables[question.id])).digest('hex'),review.tableSha256,'Table changed after review: '+question.id);
  if (review.check.type==='punctured-expression') {
    const c=review.check.point,h=0.001,tolerance=review.check.tolerance||0.00001;
    const sample=x=>evaluateExpression(review.check.expression,x);
    const left=2*sample(c-h/2)-sample(c-h),right=2*sample(c+h/2)-sample(c+h);
    const agree=Math.abs(left-right)<tolerance;
    if(!agree) assert.equal(review.check.allowSideDisagreement,true,question.id+' numerical approaches do not agree');
    const result=agree?(left+right)/2:'DNE';
    const matches=question.options.map(option=>result==='DNE'?option.startsWith('Does not exist'):Math.abs(numericalOption(option)-result)<tolerance);
    assert.equal(matches.filter(Boolean).length,1,question.id+' unique punctured-expression result');
    assert.equal(matches.indexOf(true),question.correctIndex,question.id+' punctured-expression key');
  } else if (review.check.type==='table-estimate') {
    const table=practiceTables[question.id];assert.ok(table);
    const target=review.check.inputX;
    const samples=table.rows.map(row=>row.map(value=>Number(value.replace('−','-')))).filter(([x,y])=>Number.isFinite(x)&&Number.isFinite(y)&&x!==target);
    const side=direction=>samples.filter(([x])=>direction==='left'?x<target:x>target).sort((a,b)=>Math.abs(a[0]-target)-Math.abs(b[0]-target))[0];
    const transform=([x,y])=>review.check.quotientBase!==undefined?(y-review.check.quotientBase)/(x-target):y;
    const left=side('left'),right=side('right');
    const values=review.check.side==='left'?[transform(left)]:review.check.side==='right'?[transform(right)]:[transform(left),transform(right)];
    if(review.check.disagree) assert.ok(Math.abs(values[0]-values[1])>review.check.tolerance,question.id+' side estimates must disagree');
    const result=review.check.disagree?'DNE':values.reduce((a,b)=>a+b,0)/values.length;
    const matches=question.options.map(option=>typeof result==='number'?Math.abs(numericalOption(option)-result)<review.check.tolerance:option.startsWith('Does not exist'));
    assert.equal(matches.filter(Boolean).length,1,question.id+' unique numerical estimate');assert.equal(matches.indexOf(true),question.correctIndex,question.id+' table estimate key');
  } else if (review.check.type.startsWith('figure-')) {
    const figure=practiceFigures[question.id];assert.ok(figure,'Missing original graph: '+question.id);
    assert.equal(createHash('sha256').update(JSON.stringify(figure)).digest('hex'),review.check.figureSha256,'Graph changed after review: '+question.id);
    const actual=question.options.map(option=>option.startsWith('Does not exist')?'DNE':numericalOption(option));
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
    for (const input of inputs.filter(value=>Math.abs(value)>1)) assert.ok(question.prompt.normalize('NFKC').replaceAll('−','-').includes(String(Math.abs(input))),question.id+' numeric input missing from prompt');
    const operations={
      'secant':([a,fa,b,fb])=>(fb-fa)/(b-a),
      'ratio':([change,interval])=>change/interval,
      'quadratic-rate':([quadratic,linear,t])=>2*quadratic*t+linear,
      'line-slope':([x1,y1,x2,y2])=>(y2-y1)/(x2-x1),
      'evaluate':()=>evaluateExpression(review.check.expression),
    };
    assert.ok(operations[review.check.operation],question.id+' unknown numerical check');
    const expected=operations[review.check.operation](inputs);
    const options=question.options.map(numericalOption);
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
