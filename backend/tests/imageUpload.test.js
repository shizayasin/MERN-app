import test from 'node:test';
import assert from 'node:assert/strict';
import { isAllowedImageFile } from '../utils/imageUpload.js';

test('accepts common JPEG MIME variants such as image/pjpeg', () => {
  const result = isAllowedImageFile({
    originalname: 'avatar.jpg',
    mimetype: 'image/pjpeg',
  });

  assert.equal(result, true);
});

test('accepts PNG files with common browser MIME variants', () => {
  const result = isAllowedImageFile({
    originalname: 'avatar.png',
    mimetype: 'image/x-png',
  });

  assert.equal(result, true);
});
