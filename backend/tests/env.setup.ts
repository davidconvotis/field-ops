process.env.NODE_ENV = 'test';
process.env.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'file:./test.db';
process.env.JWT_DEV_SECRET = process.env.JWT_DEV_SECRET || 'dev-secret-do-not-use-in-prod';
process.env.ENCRYPTION_DATA_KEY = process.env.ENCRYPTION_DATA_KEY || '0'.repeat(64);
process.env.STORAGE_TIMEOUT_MS = process.env.STORAGE_TIMEOUT_MS || '2000';
process.env.RETENTION_MONTHS = process.env.RETENTION_MONTHS || '12';
