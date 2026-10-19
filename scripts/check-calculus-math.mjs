// Independent recomputation pass; does not generate questions or overwrite keys.
// Numerical checks use separately reviewed prompt data and actual answer choices. Concept checks
// bind separately recorded reasoning to the current semantic question hash.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {practiceFigures} from '../src/lib/practice-figures.ts';
import {practiceTables} from '../src/lib/practice-tables.ts';
export function numericalOption(text) {
  const clean=text.replaceAll('−','-').trim();
  if(clean==='∞'||clean==='+∞')return Infinity;
  if(clean==='-∞')return -Infinity;
  const piFraction=clean.match(/^([+-]?\d+)\/π$/);if(piFraction)return Number(piFraction[1])/Math.PI;
  const piMultiple=clean.match(/^([+-]?\d+)π(?:$|\s+[A-Za-z])/);if(piMultiple)return Number(piMultiple[1])*Math.PI;
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
  const operations={add:(...xs)=>xs.reduce((a,b)=>a+b,0),mul:(...xs)=>xs.reduce((a,b)=>a*b,1),sub:(a,b)=>a-b,div:(a,b)=>a/b,pow:(a,b)=>a**b,sqrt:Math.sqrt,abs:Math.abs,cbrt:Math.cbrt,sin:Math.sin,cos:Math.cos,tan:Math.tan,asin:Math.asin,acos:Math.acos,atan:Math.atan,exp:Math.exp,ln:Math.log};
  assert.ok(operations[operation],'Unknown arithmetic expression operation');
  const expectedArity={sub:2,div:2,pow:2,sqrt:1,abs:1,cbrt:1,sin:1,cos:1,tan:1,asin:1,acos:1,atan:1,exp:1,ln:1}[operation];
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
export function approachValue(check) {
  const c=check.point,h=check.step||0.001,tolerance=check.tolerance||0.00001,factor=2**(check.order||1);
  const sample=x=>evaluateExpression(check.expression,x);
  const side=sign=>(factor*sample(c+sign*h/2)-sample(c+sign*h))/(factor-1);
  if(check.side==='left'||check.side==='right') return side(check.side==='left'?-1:1);
  const left=side(-1),right=side(1),agree=Math.abs(left-right)<tolerance;
  if(!agree) assert.equal(check.allowSideDisagreement,true,'Numerical approaches do not agree');
  return agree?(left+right)/2:'DNE';
}
const polynomialAt=(coefficients,x)=>coefficients.reduce((value,coefficient)=>value*x+coefficient,0);
function polynomialRootData(original,point) {
    let coefficients=[...original],multiplicity=0;
    assert.ok(coefficients.length&&coefficients.every(Number.isFinite)&&coefficients[0]!==0,'Invalid polynomial coefficients');
    while(coefficients.length>1&&Math.abs(polynomialAt(coefficients,point))<1e-10) {
      const quotient=[coefficients[0]];
      for(let i=1;i<coefficients.length-1;i++)quotient.push(coefficients[i]+point*quotient[i-1]);
      coefficients=quotient;multiplicity++;
    }
    return {multiplicity,value:polynomialAt(coefficients,point)};
}
export function rationalBehavior(numerator,denominator,point) {
  const n=polynomialRootData(numerator,point),d=polynomialRootData(denominator,point);
  if(d.multiplicity===0)return {kind:'No discontinuity',limit:polynomialAt(numerator,point)/polynomialAt(denominator,point)};
  if(n.multiplicity<d.multiplicity)return {kind:'Infinite discontinuity',limit:'unbounded'};
  return {kind:'Removable discontinuity',limit:n.multiplicity>d.multiplicity?0:n.value/d.value};
}
export function rationalPoleSides(numerator,denominator,point) {
  const n=polynomialRootData(numerator,point),d=polynomialRootData(denominator,point),power=d.multiplicity-n.multiplicity;
  assert.ok(power>0,'No rational pole at this input');
  const sign=Math.sign(n.value/d.value),label=s=>s>0?'+∞':'−∞';
  return {left:label(sign*((power%2)?-1:1)),right:label(sign)};
}
export function rationalEndLimit(numerator,denominator,direction) {
  for(const c of [numerator,denominator])assert.ok(c.length&&c[0]!==0&&c.every(Number.isFinite),'Invalid leading polynomial data');
  assert.ok(direction===1||direction===-1,'End direction must be ±1');
  const degree=numerator.length-denominator.length,ratio=numerator[0]/denominator[0];
  return degree<0?0:degree===0?ratio:Math.sign(ratio)*direction**degree*Infinity;
}
export function intervalOption(text) {
  if(text==='All real numbers')return [{lo:-Infinity,hi:Infinity,lc:false,rc:false}];
  const bound=s=>s==='−∞'?-Infinity:s==='∞'?Infinity:numericalOption(s);
  return text.split(' ∪ ').map(part=>{
    const match=part.match(/^([[(])([^,]+),([^\])]+)([\])])$/);assert.ok(match,'Unsupported interval notation: '+part);
    const lo=bound(match[2]),hi=bound(match[3]),lc=match[1]==='[',rc=match[4]===']';
    assert.ok(lo<hi&&(!lc||Number.isFinite(lo))&&(!rc||Number.isFinite(hi)),'Invalid interval endpoints');
    return {lo,hi,lc,rc};
  });
}
export function domainMatches(intervals,constraints) {
  const value=(coefficients,x)=>coefficients.reduce((total,c)=>total*x+c,0);
  const roots=coefficients=>{
    assert.ok(coefficients.length>=2&&coefficients.length<=3&&coefficients.every(Number.isFinite)&&coefficients[0]!==0,'Unsupported domain polynomial');
    if(coefficients.length===2)return [-coefficients[1]/coefficients[0]];
    const [a,b,c]=coefficients,d=b*b-4*a*c;return d<0?[]:d===0?[-b/(2*a)]:[(-b-Math.sqrt(d))/(2*a),(-b+Math.sqrt(d))/(2*a)];
  };
  const cuts=[...new Set([...constraints.flatMap(c=>roots(c.coefficients)),...intervals.flatMap(i=>[i.lo,i.hi]).filter(Number.isFinite)])].sort((a,b)=>a-b);
  const edges=[-Infinity,...cuts,Infinity];
  const samples=[...cuts,...edges.slice(1).map((hi,i)=>!Number.isFinite(edges[i])?(!Number.isFinite(hi)?0:hi-1):!Number.isFinite(hi)?edges[i]+1:(edges[i]+hi)/2)];
  return samples.every(x=>{
    const actual=intervals.some(i=>(x>i.lo||(i.lc&&x===i.lo))&&(x<i.hi||(i.rc&&x===i.hi)));
    const expected=constraints.every(c=>{
      const y=value(c.coefficients,x);assert.ok(['>','>=','!='].includes(c.relation));
      return c.relation==='>'?y>1e-10:c.relation==='>='?y>=-1e-10:Math.abs(y)>1e-10;
    });
    return actual===expected;
  });
}
export function completeCandidateRows(table) {
  const rows=table.rows.map(row=>row.map(s=>Number(s.replace('−','-'))));
  assert.ok(rows.length>=2&&rows.every((r,i)=>r.length===2&&r.every(Number.isFinite)&&(!i||r[0]>rows[i-1][0])));
  for(let i=1;i<rows.length;i++)assert.notEqual(rows[i][1],rows[i-1][1],'Equal adjacent values require another critical candidate by Rolle or a constant interval');
  return rows;
}
export function verifyCalculusQuestion(question, review) {
  assert.equal(review.questionId,question.id);
  assert.equal(review.optionReview.length,4);
  assert.ok(review.optionReview.every(text=>typeof text==='string' && text.length>=20));
  assert.ok(review.independentReasoning.length>=60);
  const answer=question.options[question.correctIndex];
  if(question.prompt.includes('table below')) assert.equal(createHash('sha256').update(JSON.stringify(practiceTables[question.id])).digest('hex'),review.tableSha256,'Table changed after review: '+question.id);
  if (review.check.type==='complete-extrema-table') {
    const c=review.check,rows=completeCandidateRows(practiceTables[question.id]);assert.ok(['minimum','maximum'].includes(c.kind));
    const target=c.kind==='minimum'?Math.min(...rows.map(r=>r[1])):Math.max(...rows.map(r=>r[1])),inputs=rows.filter(r=>r[1]===target).map(r=>r[0]);
    const matches=question.options.map(option=>{const proposed=c.optionInputs[option];assert.ok(Array.isArray(proposed));return proposed.length===inputs.length&&proposed.every((x,i)=>x===inputs[i]);});
    assert.equal(matches.filter(Boolean).length,1,question.id+' unique complete-table extrema');assert.equal(matches.indexOf(true),question.correctIndex,question.id+' complete-table key');
  } else if (review.check.type==='candidate-extremum') {
    const c=review.check,[a,b]=c.interval;assert.ok(a<b&&c.candidates.includes(a)&&c.candidates.includes(b));
    assert.ok(c.candidates.every(x=>Number.isFinite(x)&&a<=x&&x<=b));
    assert.ok(['minimum','maximum'].includes(c.kind)&&['value','input'].includes(c.answer));
    const values=c.candidates.map(x=>evaluateExpression(c.expression,x)),extreme=c.kind==='minimum'?Math.min(...values):Math.max(...values);
    const expected=c.answer==='value'?[extreme]:c.candidates.filter((x,i)=>Math.abs(values[i]-extreme)<1e-10);
    const matches=question.options.map(option=>expected.some(value=>Math.abs(numericalOption(option)-value)<1e-9));
    assert.equal(matches.filter(Boolean).length,1,question.id+' unique candidate extremum');
    assert.equal(matches.indexOf(true),question.correctIndex,question.id+' candidate extremum key');
  } else if (['factor-sign-intervals','factor-extrema','factor-sign-change'].includes(review.check.type)) {
    const check=review.check;assert.ok(check.scale!==0&&Number.isFinite(check.scale));
    assert.ok(check.factors.every(f=>Number.isFinite(f.root)&&Number.isInteger(f.multiplicity)&&f.multiplicity>0));
    const roots=[...new Set(check.factors.map(f=>f.root))].sort((a,b)=>a-b),excluded=check.excluded||[];
    const sign=x=>Math.sign(check.scale)*check.factors.reduce((s,f)=>s*Math.sign(x-f.root)**f.multiplicity,1);
    let matches;
    if(check.type!=='factor-sign-intervals') {
      if(check.type==='factor-extrema')assert.ok(['maximum','minimum'].includes(check.kind));
      const selected=roots.filter((r,i)=>{if(excluded.includes(r))return false;const left=i?roots[i-1]:r-2,right=i+1<roots.length?roots[i+1]:r+2;const sl=sign((left+r)/2),sr=sign((r+right)/2);return check.type==='factor-sign-change'?sl*sr<0:check.kind==='maximum'?sl>0&&sr<0:sl<0&&sr>0;});
      matches=question.options.map(option=>selected.some(r=>Math.abs(numericalOption(option)-r)<1e-10));
    } else {
      assert.ok([1,-1].includes(check.sign));
      const domain=intervalOption(check.domain||'All real numbers'),contains=(ranges,x)=>ranges.some(i=>(x>i.lo||(i.lc&&x===i.lo))&&(x<i.hi||(i.rc&&x===i.hi)));
      matches=question.options.map(option=>{
        const intervals=intervalOption(option),cuts=[...new Set([...roots,...excluded,...domain.flatMap(i=>[i.lo,i.hi]),...intervals.flatMap(i=>[i.lo,i.hi])].filter(Number.isFinite))].sort((a,b)=>a-b);
        const edges=[-Infinity,...cuts,Infinity],samples=[...cuts,...edges.slice(1).map((hi,i)=>!Number.isFinite(edges[i])?(!Number.isFinite(hi)?0:hi-1):!Number.isFinite(hi)?edges[i]+1:(edges[i]+hi)/2)];
        return samples.every(x=>contains(intervals,x)===(contains(domain,x)&&!excluded.includes(x)&&sign(x)===check.sign));
      });
    }
    assert.equal(matches.filter(Boolean).length,1,question.id+' unique factor-sign answer');
    assert.equal(matches.indexOf(true),question.correctIndex,question.id+' factor-sign key');
  } else if (review.check.type==='mvt-point') {
    const check=review.check,[a,b]=check.interval,h=0.00001;assert.ok(Number.isFinite(a)&&Number.isFinite(b)&&a<b);
    const f=x=>evaluateExpression(check.expression,x),secant=(f(b)-f(a))/(b-a);
    const matches=question.options.map(option=>{const c=numericalOption(option);return Number.isFinite(c)&&a<c&&c<b&&Math.abs((f(c+h)-f(c-h))/(2*h)-secant)<0.00001;});
    assert.equal(matches.filter(Boolean).length,1,question.id+' unique MVT point');
    assert.equal(matches.indexOf(true),question.correctIndex,question.id+' MVT point key');
  } else if (review.check.type==='dimensioned-derivative') {
    const check=review.check,units={'g/cm':[1,-1,0],cm:[0,1,0],'g/cm²':[1,-2,0],'g/s':[1,0,-1]};
    assert.ok(units[check.outputUnit]&&units[check.inputUnit]);
    const dimensions=units[check.outputUnit].map((power,i)=>power-units[check.inputUnit][i]),h=check.step;
    assert.ok(h>0&&Number.isFinite(h));
    const value=(evaluateExpression(check.expression,check.inputX+h)-evaluateExpression(check.expression,check.inputX-h))/(2*h);
    const matches=question.options.map(option=>{const parts=option.trim().split(' ');assert.equal(parts.length,2);assert.ok(units[parts[1]]);return units[parts[1]].every((power,i)=>power===dimensions[i])&&Math.abs(numericalOption(parts[0])-value)<check.tolerance;});
    assert.equal(matches.filter(Boolean).length,1,question.id+' unique dimensioned derivative');
    assert.equal(matches.indexOf(true),question.correctIndex,question.id+' dimensioned derivative key');
  } else if (review.check.type==='inverse-quantity') {
    const check=review.check,units={'cm/s':[1,-1],'s/cm':[-1,1]};assert.ok(units[check.unit]&&check.value!==0);
    assert.ok(question.prompt.includes(String(check.value)+' '+check.unit),'Original rate missing from prompt');
    const expectedUnits=units[check.unit].map(power=>-power);
    const matches=question.options.map(option=>{const parts=option.trim().split(' ');assert.equal(parts.length,2);assert.ok(units[parts[1]],'Unrecognized quantity unit');return units[parts[1]].every((power,i)=>power===expectedUnits[i])&&Math.abs(numericalOption(parts[0])-1/check.value)<1e-10;});
    assert.equal(matches.filter(Boolean).length,1,question.id+' unique inverse quantity');
    assert.equal(matches.indexOf(true),question.correctIndex,question.id+' inverse quantity key');
  } else if (review.check.type==='higher-derivative') {
    const check=review.check,h=check.step||0.001;assert.ok(h>0&&Number.isFinite(h)&&[2,3].includes(check.order));
    const rate=x=>{const f=a=>evaluateExpression(check.expression,a);return check.order===2?(f(x+h)-2*f(x)+f(x-h))/(h*h):(f(x+2*h)-2*f(x+h)+2*f(x-h)-f(x-2*h))/(2*h*h*h);};
    const matches=question.options.map(option=>{
      if(check.candidates){const candidate=check.candidates[option];assert.notEqual(candidate,undefined);assert.ok(check.samplePoints.length>=3);return check.samplePoints.every(x=>Math.abs(evaluateExpression(candidate,x)-rate(x))<check.tolerance);}
      return Math.abs(numericalOption(option)-rate(check.inputX))<check.tolerance;
    });
    assert.equal(matches.filter(Boolean).length,1,question.id+' unique higher derivative');
    assert.equal(matches.indexOf(true),question.correctIndex,question.id+' higher derivative key');
  } else if (review.check.type==='inverse-slope') {
    const check=review.check,h=check.step||0.00001,a=check.originalInput;
    assert.ok(Math.abs(evaluateExpression(check.expression,a)-check.inverseInput)<1e-9,question.id+' inverse input mismatch');
    const slope=(evaluateExpression(check.expression,a+h)-evaluateExpression(check.expression,a-h))/(2*h);
    assert.ok(Math.abs(slope)>1e-6,'Inverse slope must be nonzero');
    const matches=question.options.map(option=>Math.abs(numericalOption(option)-1/slope)<(check.tolerance||0.00001));
    assert.equal(matches.filter(Boolean).length,1,question.id+' unique inverse slope');
    assert.equal(matches.indexOf(true),question.correctIndex,question.id+' inverse slope key');
  } else if (review.check.type==='table-inverse-slope') {
    const check=review.check,table=practiceTables[question.id];assert.ok(table&&table.headers.join('|')==='x|f(x)|f′(x)');
    const rows=table.rows.map(row=>row.map(s=>Number(s.replace('−','-')))),mapped=rows.filter(row=>row[1]===check.inverseInput);assert.equal(mapped.length,1);
    assert.notEqual(mapped[0][2],0,'Inverse slope must be nonzero');
    const matches=question.options.map(option=>Math.abs(numericalOption(option)-1/mapped[0][2])<1e-10);
    assert.equal(matches.filter(Boolean).length,1,question.id+' unique inverse table slope');
    assert.equal(matches.indexOf(true),question.correctIndex,question.id+' inverse table key');
  } else if (review.check.type==='implicit-slope') {
    const check=review.check,[x,y]=check.point,h=check.step||0.0001;
    assert.ok([x,y,h].every(Number.isFinite)&&h>0);
    const setY=(expression,y)=>expression==='y'?y:Array.isArray(expression)?expression.map(child=>setY(child,y)):expression;
    const residual=(a,b)=>evaluateExpression(setY(check.expression,b),a);
    assert.ok(Math.abs(residual(x,y))<1e-9,question.id+' point not on implicit curve');
    const fx=(residual(x+h,y)-residual(x-h,y))/(2*h),fy=(residual(x,y+h)-residual(x,y-h))/(2*h);
    assert.ok(Math.abs(fy)>1e-6,question.id+' needs nonzero local y coefficient');
    const slope=-fx/fy,matches=question.options.map(option=>Math.abs(numericalOption(option)-slope)<(check.tolerance||0.00001));
    assert.equal(matches.filter(Boolean).length,1,question.id+' unique implicit slope');
    assert.equal(matches.indexOf(true),question.correctIndex,question.id+' implicit slope key');
  } else if (review.check.type==='table-composition') {
    const check=review.check,table=practiceTables[question.id];assert.ok(table&&table.headers.join('|')==='x|f(x)|f′(x)|g(x)|g′(x)');
    const rows=table.rows.map(row=>row.map(s=>Number(s.replace('−','-'))));assert.ok(rows.flat().every(Number.isFinite));
    const inner=rows.find(row=>row[0]===check.inputX);assert.ok(inner);
    const outer=rows.find(row=>row[0]===inner[1]);assert.ok(outer,'Missing composition outer input');
    const value=outer[4]*inner[2],matches=question.options.map(option=>Math.abs(numericalOption(option)-value)<1e-10);
    assert.equal(matches.filter(Boolean).length,1,question.id+' unique table composition');
    assert.equal(matches.indexOf(true),question.correctIndex,question.id+' table composition key');
  } else if (review.check.type==='table-derivative-rule') {
    const check=review.check,table=practiceTables[question.id];assert.ok(table);
    const row=table.rows.find(row=>Number(row[0].replace('−','-'))===check.inputX);assert.ok(row&&row.length===5);
    const [u,up,v,vp]=row.slice(1).map(s=>Number(s.replace('−','-')));assert.ok([u,up,v,vp].every(Number.isFinite));
    assert.ok(['product','quotient'].includes(check.operation));
    if(check.operation==='quotient')assert.notEqual(v,0,'Zero quotient denominator');
    const value=check.operation==='product'?up*v+u*vp:(up*v-u*vp)/(v*v);
    const matches=question.options.map(option=>Math.abs(numericalOption(option)-value)<1e-10);
    assert.equal(matches.filter(Boolean).length,1,question.id+' unique tabular derivative rule');
    assert.equal(matches.indexOf(true),question.correctIndex,question.id+' derivative rule key');
  } else if (review.check.type==='table-linear-derivative') {
    const check=review.check,row=practiceTables[question.id].rows.find(row=>Number(row[0].replace('−','-'))===check.inputX);assert.ok(row);
    assert.equal(row.length,check.weights.length+1);
    const value=check.weights.reduce((sum,weight,i)=>sum+weight*Number(row[i+1].replace('−','-')),0);
    const matches=question.options.map(option=>Math.abs(numericalOption(option)-value)<1e-10);
    assert.equal(matches.filter(Boolean).length,1,question.id+' unique tabular derivative combination');
    assert.equal(matches.indexOf(true),question.correctIndex,question.id+' derivative combination key');
  } else if (review.check.type==='finite-difference-estimate') {
    const check=review.check,h=check.step;assert.ok(h>0&&Number.isFinite(check.inputX));
    const rate=(evaluateExpression(check.expression,check.inputX+h)-evaluateExpression(check.expression,check.inputX-h))/(2*h);
    const matches=question.options.map(option=>Math.abs(numericalOption(option)-rate)<check.tolerance);
    assert.equal(matches.filter(Boolean).length,1,question.id+' unique finite-difference estimate');
    assert.equal(matches.indexOf(true),question.correctIndex,question.id+' finite-difference key');
  } else if (review.check.type==='derivative-function') {
    const check=review.check,h=check.step||0.001;
    assert.ok(new Set(check.samplePoints).size>=3&&check.samplePoints.every(Number.isFinite),'Need distinct derivative verification inputs');
    const matches=question.options.map(option=>{
      const candidate=check.candidates[option];assert.notEqual(candidate,undefined,'Missing derivative candidate');
      return check.samplePoints.every(x=>{
        const finiteDifference=(evaluateExpression(check.expression,x+h)-evaluateExpression(check.expression,x-h))/(2*h);
        return Math.abs(evaluateExpression(candidate,x)-finiteDifference)<(check.tolerance||0.00001);
      });
    });
    assert.equal(matches.filter(Boolean).length,1,question.id+' unique derivative model');
    assert.equal(matches.indexOf(true),question.correctIndex,question.id+' derivative function key');
  } else if (review.check.type==='table-rate') {
    const check=review.check,table=practiceTables[question.id];assert.ok(table);
    const rows=table.rows.map(row=>row.map(s=>Number(s.replace('−','-'))));
    const first=rows.find(([x])=>x===check.start),last=rows.find(([x])=>x===check.end);
    assert.ok(first&&last&&check.start!==check.end,'Missing or zero-length rate interval');
    const rate=(last[1]-first[1])/(last[0]-first[0]);
    const matches=question.options.map(option=>Math.abs(numericalOption(option)-rate)<1e-10);
    assert.equal(matches.filter(Boolean).length,1,question.id+' unique tabular rate');
    assert.equal(matches.indexOf(true),question.correctIndex,question.id+' table rate key');
  } else if (review.check.type==='ivt-bracket') {
    const check=review.check,matches=question.options.map(option=>{
      const intervals=intervalOption(option);assert.equal(intervals.length,1);
      const {lo,hi}=intervals[0];assert.ok(Number.isFinite(lo)&&Number.isFinite(hi));
      return (polynomialAt(check.coefficients,lo)-check.target)*(polynomialAt(check.coefficients,hi)-check.target)<0;
    });
    assert.equal(matches.filter(Boolean).length,1,question.id+' unique strict IVT bracket');
    assert.equal(matches.indexOf(true),question.correctIndex,question.id+' IVT bracket key');
  } else if (review.check.type==='ivt-table'||review.check.type==='ivt-values') {
    const check=review.check;
    let matches;
    if(check.type==='ivt-values')matches=question.options.map(option=>{const value=numericalOption(option);return value>Math.min(...check.endpointValues)&&value<Math.max(...check.endpointValues);});
    else {
      const rows=practiceTables[question.id].rows.map(row=>row.map(s=>Number(s.replace('−','-'))));
      assert.ok(rows.every(([x,y],i)=>Number.isFinite(x)&&Number.isFinite(y)&&(!i||x>rows[i-1][0])));
      const count=rows.slice(1).filter(([x,y],i)=>(y-check.target)*(rows[i][1]-check.target)<0).length;
      matches=question.options.map(option=>numericalOption(option)===count);
    }
    assert.equal(matches.filter(Boolean).length,1,question.id+' unique IVT guarantee');
    assert.equal(matches.indexOf(true),question.correctIndex,question.id+' IVT guarantee key');
  } else if (review.check.type==='rational-end-candidates') {
    const check=review.check,matches=question.options.map(option=>{
      const candidate=check.candidates[option];assert.ok(candidate,'Missing candidate model');
      return rationalEndLimit(candidate.numerator,candidate.denominator,check.direction)===check.target;
    });
    assert.equal(matches.filter(Boolean).length,1,question.id+' unique end-behavior candidate');
    assert.equal(matches.indexOf(true),question.correctIndex,question.id+' end-behavior candidate key');
  } else if (review.check.type==='rational-end'||review.check.type==='end-expression') {
    const check=review.check;
    const expected=check.type==='rational-end'?rationalEndLimit(check.numerator,check.denominator,check.direction):(()=>{
      const base=check.direction*(check.scale||10000),factor=2**(check.order||1);
      return (factor*evaluateExpression(check.expression,2*base)-evaluateExpression(check.expression,base))/(factor-1);
    })();
    const matches=question.options.map(option=>{const value=numericalOption(option);return Number.isFinite(expected)?Math.abs(value-expected)<(check.tolerance||0.00001):value===expected;});
    assert.equal(matches.filter(Boolean).length,1,question.id+' unique end limit');
    assert.equal(matches.indexOf(true),question.correctIndex,question.id+' end limit key');
  } else if (review.check.type==='rational-pole') {
    const check=review.check,sides=rationalPoleSides(check.numerator,check.denominator,check.point);
    const expected=check.side==='pair'?`Left: ${sides.left}; right: ${sides.right}`:check.side==='both'?(sides.left===sides.right?sides.left:'Does not exist'):sides[check.side];
    assert.ok(expected,'Unknown pole side');
    const matches=question.options.map(option=>option===expected||(expected==='Does not exist'&&option.startsWith(expected)));
    assert.equal(matches.filter(Boolean).length,1,question.id+' unique pole limit');
    assert.equal(matches.indexOf(true),question.correctIndex,question.id+' pole sign key');
  } else if (review.check.type==='domain-intervals') {
    const matches=question.options.map(option=>domainMatches(intervalOption(option),review.check.constraints));
    assert.equal(matches.filter(Boolean).length,1,question.id+' unique domain interval');
    assert.equal(matches.indexOf(true),question.correctIndex,question.id+' domain key');
  } else if (review.check.type==='rational-classification') {
    const result=rationalBehavior(review.check.numerator,review.check.denominator,review.check.point);
    assert.equal(result.limit,review.check.expectedLimit,question.id+' separately computed rational limit');
    const matches=question.options.map(option=>option.startsWith(result.kind));
    assert.equal(matches.filter(Boolean).length,1,question.id+' unique rational classification');
    assert.equal(matches.indexOf(true),question.correctIndex,question.id+' rational classification key');
  } else if (review.check.type==='squeeze-bounds') {
    const {lower,upper,...settings}=review.check;
    const tolerance=settings.tolerance||0.00001;
    const lo=approachValue({...settings,expression:lower}),hi=approachValue({...settings,expression:upper});
    assert.ok(typeof lo==='number'&&typeof hi==='number'&&Math.abs(lo-hi)<tolerance,question.id+' bounding limits disagree');
    const signs=settings.side==='right'?[1]:settings.side==='left'?[-1]:[-1,1];
    for(const sign of signs) for(const scale of [1,0.5]) {
      const x=settings.point+sign*(settings.step||0.001)*scale;
      assert.ok(evaluateExpression(lower,x)<=evaluateExpression(upper,x),question.id+' lower bound exceeds upper bound');
    }
    const result=(lo+hi)/2,matches=question.options.map(option=>Math.abs(numericalOption(option)-result)<tolerance);
    assert.equal(matches.filter(Boolean).length,1,question.id+' unique squeeze result');
    assert.equal(matches.indexOf(true),question.correctIndex,question.id+' squeeze key');
  } else if (review.check.type==='procedure') {
    const result=approachValue(review.check.limitCheck),expected=review.check.expectedLimit;
    assert.ok(typeof expected==='number'?typeof result==='number'&&Math.abs(result-expected)<(review.check.limitCheck.tolerance||0.00001):result===expected,question.id+' underlying limit corroboration');
    assert.equal(answer,review.check.expectedAnswer,question.id+' procedure answer needs re-review');
  } else if (review.check.type==='punctured-expression') {
    const tolerance=review.check.tolerance||0.00001,result=approachValue(review.check);
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
    if(review.check.type==='figure-slope') {
      const slopes=[];
      for(const curve of figure.curves)for(let i=1;i<curve.points.length;i++) {
        const [x1,y1]=curve.points[i-1],[x2,y2]=curve.points[i];
        if(x1<review.check.inputX&&review.check.inputX<x2)slopes.push((y2-y1)/(x2-x1));
      }
      assert.equal(slopes.length,1,question.id+' needs one local straight segment, not a vertex');
      matches=actual.map(value=>Math.abs(value-slopes[0])<1e-10);
    } else if(review.check.type==='figure-limit-location') matches=actual.map(target=>typeof target==='number'&&Number.isFinite(target)&&typeof figureLimit(figure,target)==='number');
    else {
      const target=review.check.inputX+(review.check.inputShift||0);
      const limit=figureLimit(figure,target,review.check.side);
      const result=typeof limit==='number'?limit*(review.check.outputScale??1)+(review.check.outputOffset||0):limit;
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
