import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRatingSummary, removeReviewAndRecalculate } from '../utils/reviewUtils.js';

test('calculateRatingSummary returns the correct average and count', () => {
  const result = calculateRatingSummary([
    { rating: 5 },
    { rating: 3 },
    { rating: 4 },
  ]);

  assert.equal(result.averageRating, 4);
  assert.equal(result.numReviews, 3);
});

test('calculateRatingSummary handles an empty review list', () => {
  const result = calculateRatingSummary([]);

  assert.equal(result.averageRating, 0);
  assert.equal(result.numReviews, 0);
});

test('removeReviewAndRecalculate removes the selected review and updates summary', () => {
  const reviews = [
    { _id: '1', rating: 5 },
    { _id: '2', rating: 3 },
    { _id: '3', rating: 4 },
  ];

  const result = removeReviewAndRecalculate(reviews, '2');

  assert.equal(result.reviews.length, 2);
  assert.equal(result.summary.averageRating, 4.5);
  assert.equal(result.summary.numReviews, 2);
});
