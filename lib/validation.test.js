/**
 * PULSE Command — Validation Tests
 * 
 * Runs validations against the helper utilities in lib/validation.js.
 * Execute using: node --test lib/validation.test.js
 */

import test from 'node:test';
import assert from 'node:assert';
import { 
  validateString, 
  validateEnum, 
  validateObject, 
  validateArray, 
  parseBoundedNumber 
} from './validation.js';

test('validateString utility', () => {
  // Test valid cases
  assert.strictEqual(validateString('  hello  ', 3, 10, 'field'), 'hello');
  
  // Test invalid length cases
  assert.throws(() => validateString('hi', 3, 10, 'field'), /field must be between 3 and 10 characters/);
  assert.throws(() => validateString('too long string here', 3, 10, 'field'), /field must be between 3 and 10 characters/);
  
  // Test invalid type cases
  assert.throws(() => validateString(123, 1, 10, 'field'), /field must be a string/);
  assert.throws(() => validateString(null, 1, 10, 'field'), /field must be a string/);
});

test('validateEnum utility', () => {
  const allowed = ['a', 'b', 'c'];
  
  // Test valid cases
  assert.strictEqual(validateEnum('b', allowed, 'enumField'), 'b');
  
  // Test invalid cases
  assert.throws(() => validateEnum('d', allowed, 'enumField'), /enumField is invalid/);
});

test('validateObject utility', () => {
  // Test valid cases
  const obj = { key: 'value' };
  assert.deepStrictEqual(validateObject(obj, 'objField'), obj);
  
  // Test invalid cases
  assert.throws(() => validateObject([], 'objField'), /objField must be a valid non-array object/);
  assert.throws(() => validateObject(null, 'objField'), /objField must be a valid non-array object/);
  assert.throws(() => validateObject('not an object', 'objField'), /objField must be a valid non-array object/);
});

test('validateArray utility', () => {
  const arr = [1, 2, 3];
  
  // Test valid cases
  assert.deepStrictEqual(validateArray(arr, 5, 'arrField'), arr);
  
  // Test size limits
  assert.throws(() => validateArray(arr, 2, 'arrField'), /arrField size cannot exceed 2 items/);
  
  // Test invalid types
  assert.throws(() => validateArray({}, 5, 'arrField'), /arrField must be a valid array/);
});

test('parseBoundedNumber utility', () => {
  // Test valid ranges
  assert.strictEqual(parseBoundedNumber('4.5', 1, 1, 10), 4.5);
  assert.strictEqual(parseBoundedNumber(null, 2.5, 1, 10), 2.5);
  
  // Test bounded clamping/fallbacks
  assert.strictEqual(parseBoundedNumber('15', 1.0, 1, 10), 1.0);
  assert.strictEqual(parseBoundedNumber('invalid', 3.0, 1, 10), 3.0);
});
