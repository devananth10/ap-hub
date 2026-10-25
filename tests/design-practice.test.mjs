import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { JSDOM } from 'jsdom';
import { practiceEntries } from '../src/lib/practice.ts';

const require = createRequire(import.meta.url);
const moduleURL = source => 'data:text/javascript;base64,' + Buffer.from(source).toString('base64');
let source = ts.transpileModule(readFileSync('src/components/practice-question.tsx','utf8'),{
  compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022},
}).outputText;
const imports = {
  react:pathToFileURL(require.resolve('react')).href,
  'react/jsx-runtime':pathToFileURL(require.resolve('react/jsx-runtime')).href,
  'lucide-react':pathToFileURL(require.resolve('lucide-react')).href,
  './practice-figure':moduleURL('export function PracticeFigure(){return null}'),
  './practice-table':moduleURL('export function PracticeTable(){return null}'),
  './geography-stimulus':moduleURL('export function GeographyStimulus(){return null}'),
  '@/lib/geography-stimuli':moduleURL('export const geographyStimuli={}'),
};
for(const [name,url] of Object.entries(imports))source=source.replaceAll(JSON.stringify(name),JSON.stringify(url));
const {PracticeQuestion}=await import(moduleURL(source));
const question=practiceEntries({courseId:'chemistry',unitNumber:1,topicId:'moles'})[0].question;

function mount(answer,disabled=false,onSelect=()=>{}){
  const dom=new JSDOM('<!doctype html><html><body></body></html>');
  globalThis.window=dom.window;globalThis.document=dom.window.document;
  globalThis.IS_REACT_ACT_ENVIRONMENT=true;
  const view=render(React.createElement(PracticeQuestion,{practice:question,answer,disabled,onSelect,onCheck:()=>{},onRetry:()=>{}}));
  return {view,close(){view.unmount();dom.window.close();}};
}

test('Practice choices keep original text and native radio selection without revealing an answer early',()=>{
  let selected=null;const {view,close}=mount({selected:null,checked:false},false,value=>selected=value);
  try{
    assert.deepEqual([...view.container.querySelectorAll('.answer-text')].map(e=>e.textContent),question.options);
    assert.equal(view.container.querySelectorAll('.answer-state').length,0);
    const radios=view.getAllByRole('radio');assert.equal(radios.length,4);
    fireEvent.click(radios[2]);assert.equal(selected,2);
    assert.equal(view.getByRole('button',{name:'Check answer'}).disabled,true);
  }finally{close();}
});
test('graded incorrect choices identify both the selected error and correct answer without relying on color',()=>{
  const wrong=(question.correctIndex+1)%4;
  const {view,close}=mount({selected:wrong,checked:true});
  try{
    assert.equal(view.getByText('Your answer · Incorrect').closest('label').querySelector('input').value,String(wrong));
    assert.equal(view.getByText('Correct answer').closest('label').querySelector('input').value,String(question.correctIndex));
    assert.ok(view.container.querySelector('fieldset').disabled);
    assert.equal(view.getAllByRole('radio').filter(input=>input.checked).length,1);
  }finally{close();}
});
test('graded correct choices are explicit while external loading guards still disable interaction',()=>{
  const {view,close}=mount({selected:question.correctIndex,checked:true},true);
  try{
    assert.equal(view.getByText('Your answer · Correct').closest('label').querySelector('input').value,String(question.correctIndex));
    assert.equal(view.queryByText('Your answer · Incorrect'),null);
    assert.ok(view.container.querySelector('fieldset').disabled);
    assert.ok(view.getByRole('button',{name:'Try again'}).disabled);
  }finally{close();}
});
