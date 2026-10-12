const test = require('node:test');
const assert = require('node:assert/strict');
const { evaluate } = require('../calculator');

test('basic operations', () => {
  assert.equal(evaluate('2+3'), 5);
  assert.equal(evaluate('10-4'), 6);
  assert.equal(evaluate('6x7'), 42);
  assert.equal(evaluate('9/3'), 3);
});

test('operator precedence and parentheses', () => {
  assert.equal(evaluate('2+3x4'), 14);
  assert.equal(evaluate('(2+3)x4'), 20);
  assert.equal(evaluate('10-2-3'), 5);
  assert.equal(evaluate('100/10/2'), 5);
});

test('negative numbers', () => {
  assert.equal(evaluate('-5+2'), -3);
  assert.equal(evaluate('3x-2'), -6);
  assert.equal(evaluate('-(2+3)'), -5);
});

test('percentages', () => {
  assert.equal(evaluate('50%'), 0.5);
  assert.equal(evaluate('200x15%'), 30);
});

test('floating point noise is rounded', () => {
  assert.equal(evaluate('0.1+0.2'), 0.3);
});

test('empty input is zero', () => {
  assert.equal(evaluate(''), 0);
});

test('invalid input throws', () => {
  assert.throws(() => evaluate('5/0'), /divide by zero/);
  assert.throws(() => evaluate('2++3'), /Unexpected operator/);
  assert.throws(() => evaluate('(2+3'), /parentheses/);
  assert.throws(() => evaluate('1.2.3'), /Invalid number/);
  assert.throws(() => evaluate('2+'), /Incomplete/);
  assert.throws(() => evaluate('alert(1)'), /Invalid character/);
});
