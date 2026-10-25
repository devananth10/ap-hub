// Render the actual account menu with isolated identity and sync hooks; no live login.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';
import React from 'react';
import {render,fireEvent,act} from '@testing-library/react';
import {JSDOM} from 'jsdom';

const require=createRequire(import.meta.url);
const moduleURL=source=>'data:text/javascript;base64,'+Buffer.from(source).toString('base64');
const packageURL=name=>pathToFileURL(require.resolve(name)).href;
let source=ts.transpileModule(readFileSync('src/components/account-menu.tsx','utf8'),{
 compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022},
}).outputText;
const imports={
 react:packageURL('react'),'react/jsx-runtime':packageURL('react/jsx-runtime'),'lucide-react':packageURL('lucide-react'),
 'next/link':moduleURL(`import React from ${JSON.stringify(packageURL('react'))};export default function Link(props){return React.createElement('a',props);}`),
 'next/navigation':moduleURL('export function usePathname(){return globalThis.__menuPath}'),
 './auth-provider':moduleURL('export function useAuth(){return globalThis.__menuAuth}'),
 './study-provider':moduleURL('export function useStudy(){return {syncStatus:"saved"}}'),
};
for(const [name,url]of Object.entries(imports))source=source.replaceAll(JSON.stringify(name),JSON.stringify(url));
const {AccountMenu}=await import(moduleURL(source));

function mount(user,signOut=async()=>true){
 const dom=new JSDOM('<!doctype html><html><body></body></html>',{url:'http://127.0.0.1:3000'});
 globalThis.window=dom.window;globalThis.document=dom.window.document;globalThis.Node=dom.window.Node;
 globalThis.IS_REACT_ACT_ENVIRONMENT=true;globalThis.__menuPath='/courses/chemistry';globalThis.__menuAuth={user,signOut};
 const view=render(React.createElement(AccountMenu));
 return {view,close(){view.unmount();dom.window.close();}};
}

test('guests see Sign in with their current return path and no profile initial',()=>{
 const {view,close}=mount(null);
 try{assert.equal(view.getByRole('link',{name:'Sign in'}).getAttribute('href'),'/login?next=%2Fcourses%2Fchemistry');assert.equal(view.container.querySelector('.avatar'),null);}finally{close();}
});

test('signed-in account trigger shows first/last initials and the account destinations',()=>{
 const {view,close}=mount({id:'test-student',displayName:'  Alex   Jordan Smith  '});
 try{
  const menu=view.container.querySelector('details');menu.open=true;
  assert.equal(view.container.querySelector('.avatar').textContent,'AS');
  assert.equal(view.getByLabelText('Open account menu').title,'Alex Jordan Smith');
  assert.equal(view.getByRole('link',{name:'Account settings'}).getAttribute('href'),'/account');
  assert.equal(view.getByRole('link',{name:'My progress'}).getAttribute('href'),'/progress');
  fireEvent.keyDown(document,{key:'Escape'});assert.equal(menu.open,false);assert.equal(document.activeElement,menu.querySelector('summary'));
  menu.open=true;fireEvent.pointerDown(view.container.querySelector('.avatar'));assert.equal(menu.open,true);
  fireEvent.pointerDown(document.body);assert.equal(menu.open,false);
 }finally{close();}
});

test('missing names use a neutral icon, and a single name uses one initial',()=>{
 const {view,close}=mount({id:'test-student',displayName:'  '});
 try{
  assert.ok(view.container.querySelector('.avatar svg'));assert.equal(view.container.querySelector('.avatar').textContent,'');
  globalThis.__menuAuth.user.displayName='Taylor';view.rerender(React.createElement(AccountMenu));assert.equal(view.container.querySelector('.avatar').textContent,'T');
 }finally{close();}
});

test('navigation closes the menu and a failed sign-out remains visible for retry',async()=>{
 let calls=0;const {view,close}=mount({id:'test-student',displayName:'Alex Smith'},async()=>{calls++;return false;});
 try{
  view.container.querySelector('details').open=true;
  await act(async()=>{fireEvent.click(view.getByRole('button',{name:'Sign out'}));});
  assert.equal(calls,1);assert.equal(view.getByRole('alert').textContent,'Could not sign out. Please retry.');assert.equal(view.getByRole('button',{name:'Sign out'}).disabled,false);
  globalThis.__menuPath='/progress';view.rerender(React.createElement(AccountMenu));assert.equal(view.container.querySelector('details').open,false);
 }finally{close();}
});
