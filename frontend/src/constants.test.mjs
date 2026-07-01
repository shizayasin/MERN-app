import test from 'node:test';
import assert from 'node:assert/strict';
import { getAssetUrl } from './constants.js';

test('getAssetUrl returns data URLs unchanged', () => {
  const dataUrl = 'data:image/png;base64,abc123';
  assert.equal(getAssetUrl(dataUrl), dataUrl);
});

test('getAssetUrl preserves absolute and root-relative paths', () => {
  assert.equal(getAssetUrl('/uploads/test.jpg'), '/uploads/test.jpg');
  assert.equal(getAssetUrl('https://cdn.example.com/test.jpg'), 'https://cdn.example.com/test.jpg');
});
