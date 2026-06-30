const calculateRatingSummary = (reviews = []) => {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return { averageRating: 0, numReviews: 0 };
  }

  const total = reviews.reduce((sum, review) => sum + Number(review?.rating || 0), 0);
  const averageRating = Number((total / reviews.length).toFixed(1));

  return {
    averageRating,
    numReviews: reviews.length,
  };
};

const removeReviewAndRecalculate = (reviews = [], reviewId) => {
  const filteredReviews = (Array.isArray(reviews) ? reviews : []).filter(
    (review) => review?._id?.toString() !== reviewId?.toString()
  );

  return {
    reviews: filteredReviews,
    summary: calculateRatingSummary(filteredReviews),
  };
};

export { calculateRatingSummary, removeReviewAndRecalculate };
