import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';
import React from 'react';
import {JSDOM} from 'jsdom';

const initialDOM = new JSDOM('<!doctype html><html><body></body></html>');
globalThis.window = initialDOM.window;
globalThis.document = initialDOM.window.document;
const {render, fireEvent, act} = await import('@testing-library/react');

const require = createRequire(import.meta.url);
const moduleURL = source => 'data:text/javascript;base64,' + Buffer.from(source).toString('base64');
const packageURL = name => pathToFileURL(require.resolve(name)).href;
let source = ts.transpileModule(readFileSync('src/components/auth-form.tsx', 'utf8'), {
  compilerOptions: {jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022},
}).outputText;
const imports = {
  react: packageURL('react'),
  'react/jsx-runtime': packageURL('react/jsx-runtime'),
  'lucide-react': packageURL('lucide-react'),
  'next/link': moduleURL(`import React from ${JSON.stringify(packageURL('react'))};export default function Link(props){return React.createElement('a',props);}`),
  'next/navigation': moduleURL('export function useSearchParams(){return new URLSearchParams("next=%2Fcourses%2Fchemistry")}'),
  './auth-provider': moduleURL('export function useAuth(){return globalThis.__recoveryAuth} export function accountRequest(...args){return globalThis.__recoveryRequest(...args)}'),
  '@/lib/account-policy': new URL('../src/lib/account-policy.ts', import.meta.url).href,
};
for (const [name, url] of Object.entries(imports)) source = source.replaceAll(JSON.stringify(name), JSON.stringify(url));
const {AuthForm} = await import(moduleURL(source));

function mount(mode = 'forgot') {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {url: 'http://127.0.0.1:3000/forgot-password'});
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  globalThis.__recoveryAuth = {ready: true, configured: true, registration: false, refresh: async () => {}};
  const view = render(React.createElement(AuthForm, {mode}));
  return {view, close() {view.unmount(); dom.window.close();}};
}

test('recovery success waits for acceptance, announces generic copy and moves focus', async () => {
  let accept;
  let submitted;
  globalThis.__recoveryRequest = (path, body) => {
    submitted = {path, body};
    return new Promise(resolve => {accept = resolve;});
  };
  const {view, close} = mount();
  try {
    fireEvent.change(view.getByLabelText('Email'), {target: {value: 'student@example.invalid'}});
    fireEvent.submit(view.container.querySelector('form'));
    assert.equal(view.queryByText('Check your email!'), null);
    assert.equal(view.getByRole('button', {name: 'Please wait…'}).disabled, true);
    assert.equal(view.getByLabelText('Email').disabled, true);
    assert.equal(submitted.path, '/api/auth');
    assert.equal(submitted.body.action, 'forgot');
    assert.equal(submitted.body.email, 'student@example.invalid');
    await act(async () => {accept({ok: true, message: 'Existing server acknowledgement'});});
    const heading = view.getByRole('heading', {name: 'Check your email!', level: 1});
    assert.equal(document.activeElement, heading);
    const status = view.getByRole('status');
    assert.match(status.textContent, /If an account exists for that email address, we'll send a password-reset link shortly\./);
    assert.match(status.textContent, /Don't see it\? Check your spam folder\./);
    assert.equal(status.getAttribute('aria-live'), 'polite');
    assert.equal(view.container.querySelector('form'), null);
    assert.equal(view.container.textContent.includes('student@example.invalid'), false);
    assert.ok(view.container.querySelector('.recovery-success-icon[aria-hidden="true"] svg'));
    assert.equal(view.getByRole('link', {name: 'Back to sign in'}).getAttribute('href'), '/login?next=%2Fcourses%2Fchemistry');
  } finally {close();}
});

test('a rejected reset keeps the form and entered email available for retry', async () => {
  globalThis.__recoveryRequest = async () => {throw new Error('Authentication is temporarily unavailable.');};
  const {view, close} = mount();
  try {
    fireEvent.change(view.getByLabelText('Email'), {target: {value: 'student@example.invalid'}});
    await act(async () => {fireEvent.submit(view.container.querySelector('form'));});
    assert.equal(view.queryByText('Check your email!'), null);
    assert.equal(view.getByRole('alert').textContent, 'Authentication is temporarily unavailable.');
    assert.equal(view.getByLabelText('Email').value, 'student@example.invalid');
    assert.equal(view.getByRole('button', {name: 'Send reset link'}).disabled, false);
  } finally {close();}
});

test('unavailable cloud configuration leaves reset submission disabled', () => {
  const {view, close} = mount();
  try {
    globalThis.__recoveryAuth.configured = false;
    view.rerender(React.createElement(AuthForm, {mode: 'forgot'}));
    assert.equal(view.getByRole('button', {name: 'Send reset link'}).disabled, true);
    assert.equal(view.queryByText('Check your email!'), null);
  } finally {close();}
});

test('password-change acknowledgement retains its existing presentation', async () => {
  globalThis.__recoveryRequest = async () => ({ok: true, message: 'Password updated.'});
  const {view, close} = mount('password');
  try {
    await act(async () => {fireEvent.submit(view.container.querySelector('form'));});
    assert.equal(view.queryByText('Check your email!'), null);
    assert.equal(view.getByRole('status').textContent, 'Password updated.');
    assert.ok(view.getByRole('button', {name: 'Save new password'}));
  } finally {close();}
});
