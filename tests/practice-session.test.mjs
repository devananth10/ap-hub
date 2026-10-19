import assert from 'node:assert/strict';
import test from 'node:test';
import { initialSession, sessionReducer, sessionScore } from '../src/lib/practice-session.ts';
import { questionBatches } from '../src/lib/practice-bank.ts';

const questions = questionBatches.flatMap(batch => batch.questions);
const select = (state, question, selected) => sessionReducer(state, { type: 'select', id: question.id, selected });
const check = (state, question) => sessionReducer(state, { type: 'check', id: question.id });

test('every published answer key grades exactly one choice correctly', () => {
  for (const question of questions) for (let option = 0; option < 4; option++) {
    const state = check(select(initialSession, question, option), question);
    assert.deepEqual(sessionScore([question], state.answers), {
      correct: Number(option === question.correctIndex), answered: 1, total: 1,
      percent: option === question.correctIndex ? 100 : 0,
    });
  }
});

test('moving preserves both checked answers and unchecked selections without mounting all questions', () => {
  const [first, second] = questions;
  let state = check(select(initialSession, first, first.correctIndex), first);
  state = sessionReducer(state, { type: 'move', index: 1, total: 11 });
  state = select(state, second, 0);
  state = sessionReducer(state, { type: 'move', index: 0, total: 11 });
  assert.equal(state.answers[first.id].checked, true);
  assert.equal(state.answers[first.id].selected, first.correctIndex);
  assert.equal(state.answers[second.id].selected, 0);
  assert.equal(state.answers[second.id].checked, false);
});

test('retry feedback never replaces or double-counts the first graded answer', () => {
  const question = questions[0];
  let state = check(select(initialSession, question, (question.correctIndex + 1) % 4), question);
  state = sessionReducer(state, { type: 'retry', id: question.id });
  state = check(select(state, question, question.correctIndex), question);
  assert.equal(state.answers[question.id].selected, question.correctIndex);
  assert.equal(state.answers[question.id].checked, true);
  assert.deepEqual(sessionScore([question], state.answers), { correct: 0, answered: 1, total: 1, percent: 0 });
});

test('finishing grades remaining selections, counts unanswered as incorrect, and retains results for review', () => {
  const topic = questionBatches[0].questions;
  let state = select(initialSession, topic[0], topic[0].correctIndex);
  state = check(select(state, topic[1], (topic[1].correctIndex + 1) % 4), topic[1]);
  state = sessionReducer(state, { type: 'finish' });
  assert.equal(state.finished, true);
  assert.deepEqual(sessionScore(topic, state.answers), { correct: 1, answered: 2, total: 11, percent: 9 });
  const reviewed = sessionReducer(state, { type: 'review' });
  assert.equal(reviewed.finished, false);
  assert.deepEqual(reviewed.answers, state.answers);
  assert.equal(reviewed.answers[topic[0].id].checked, true);
  assert.deepEqual(sessionReducer(reviewed, { type: 'restart' }), initialSession);
});

test('a complete published-bank session scores correctly with no persistence or rounding drift', () => {
  let state = initialSession;
  for (const question of questions) state = check(select(state, question, question.correctIndex), question);
  state = sessionReducer(state, { type: 'finish' });
  assert.deepEqual(sessionScore(questions, state.answers), { correct: questions.length, answered: questions.length, total: questions.length, percent: 100 });
  assert.deepEqual(sessionScore([], {}), { correct: 0, answered: 0, total: 0, percent: 0 });
});

test('invalid choices, checks without selections, edits after grading and navigation boundaries are safe', () => {
  const question = questions[0];
  assert.equal(check(initialSession, question), initialSession);
  for (const invalid of [-1, 4, NaN, 1.2]) assert.equal(select(initialSession, question, invalid), initialSession);
  const checked = check(select(initialSession, question, 0), question);
  assert.equal(select(checked, question, 1), checked);
  assert.equal(sessionReducer(initialSession, { type: 'move', index: -1, total: 11 }).index, 0);
  assert.equal(sessionReducer(initialSession, { type: 'move', index: 20, total: 11 }).index, 10);
  assert.equal(sessionReducer(initialSession, { type: 'move', index: 1, total: NaN }), initialSession);
});
