import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeEnv, validateEnv } from '../config/env.js';

test('normalizeEnv strips a duplicated MONGO_URI prefix', () => {
  const normalized = normalizeEnv({
    MONGO_URI: 'MONGO_URI=mongodb://localhost:27017/StyleHub',
    JWT_SECRET: 'test-secret',
  });

  assert.equal(normalized.MONGO_URI, 'mongodb://localhost:27017/StyleHub');
});

test('validateEnv rejects missing production values', () => {
  const originalEnv = { ...process.env };

  process.env.NODE_ENV = 'production';
  delete process.env.MONGO_URI;
  delete process.env.JWT_SECRET;

  assert.throws(() => validateEnv(), /MONGO_URI|JWT_SECRET/);

  process.env = originalEnv;
});

test('validateEnv accepts strong production values', () => {
  const originalEnv = { ...process.env };

  process.env.NODE_ENV = 'production';
  process.env.MONGO_URI = 'mongodb://localhost:27017/store';
  process.env.JWT_SECRET = 'a-very-secure-production-secret-12345';

  assert.doesNotThrow(() => validateEnv());

  process.env = originalEnv;
});
