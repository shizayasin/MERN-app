const getFallbackProductsPayload = () => ({
  products: [],
  page: 1,
  pages: 1,
  total: 0,
});

const createFallbackUserPayload = (user) => ({
  _id: user?._id,
  username: user?.username,
  email: user?.email,
  isAdmin: Boolean(user?.isAdmin),
});

const isDatabaseUnavailable = (error) => {
  const message = error?.message || String(error || "");
  return /buffering timed out|ECONNREFUSED|MongoServerSelectionError|MongooseServerSelectionError|topology was destroyed|failed to connect/i.test(message);
};

export { getFallbackProductsPayload, createFallbackUserPayload, isDatabaseUnavailable };
