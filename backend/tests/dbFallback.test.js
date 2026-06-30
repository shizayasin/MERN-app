import test from 'node:test';
import assert from 'node:assert/strict';
import { getFallbackProductsPayload, createFallbackUserPayload } from '../utils/dbFallback.js';

test('getFallbackProductsPayload returns an empty product list when the database is unavailable', () => {
  const payload = getFallbackProductsPayload();

  assert.deepEqual(payload.products, []);
  assert.equal(payload.page, 1);
  assert.equal(payload.pages, 1);
  assert.equal(payload.total, 0);
});

test('createFallbackUserPayload returns a safe user payload for offline registration', () => {
  const payload = createFallbackUserPayload({
    _id: 'fallback-user',
    username: 'offline-user',
    email: 'offline@example.com',
    isAdmin: false,
  });

  assert.equal(payload.username, 'offline-user');
  assert.equal(payload.email, 'offline@example.com');
  assert.equal(payload.isAdmin, false);
});
