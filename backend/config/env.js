const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];

const normalizeEnv = (env = process.env) => {
  const normalizedEnv = { ...env };

  if (typeof normalizedEnv.MONGO_URI === 'string') {
    normalizedEnv.MONGO_URI = normalizedEnv.MONGO_URI
      .replace(/^MONGO_URI\s*=\s*/i, '')
      .trim();
  }

  if (!normalizedEnv.MONGO_URI) {
    normalizedEnv.MONGO_URI = 'mongodb://localhost:27017/StyleHub';
  }

  return normalizedEnv;
};

const validateEnv = () => {
  const env = normalizeEnv();
  const missing = requiredEnvVars.filter((key) => {
    const value = env[key];
    return !value || !String(value).trim();
  });

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  if (!/^mongodb(?:\+srv)?:\/\//i.test(env.MONGO_URI)) {
    throw new Error('MONGO_URI must start with mongodb:// or mongodb+srv://');
  }

  process.env.MONGO_URI = env.MONGO_URI;

  if (process.env.NODE_ENV === 'production') {
    if (!process.env.JWT_SECRET || String(process.env.JWT_SECRET).length < 24) {
      throw new Error('JWT_SECRET must be at least 24 characters in production');
    }
  }
};

export { normalizeEnv, validateEnv };
