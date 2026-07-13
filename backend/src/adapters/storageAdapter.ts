export {};

const fs = require('fs/promises');
const path = require('path');
const { STORAGE_TIMEOUT_MS } = require('../constants');

class StorageUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageUnavailableError';
  }
}

class StorageTimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageTimeoutError';
  }
}

const LOCAL_DIR = path.join(__dirname, '..', '..', 'storage-local');

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new StorageTimeoutError(`timeout tras ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

/**
 * NFR-06b: interfaz put/get/delete con timeout explícito.
 * Prod: bucket S3-compatible (fuera de alcance de este slice).
 * Dev/test: filesystem local bajo backend/storage-local/ (gitignored).
 */
async function put(key: string, buffer: Buffer): Promise<void> {
  if (process.env.STORAGE_SIMULATE_FAILURE === 'true') {
    throw new StorageUnavailableError('storage no disponible (simulado)');
  }
  if (process.env.STORAGE_SIMULATE_TIMEOUT === 'true') {
    await withTimeout(new Promise((resolve) => setTimeout(resolve, STORAGE_TIMEOUT_MS + 1000)), STORAGE_TIMEOUT_MS);
    return; // nunca llega aquí, withTimeout rechaza antes
  }
  await withTimeout(
    (async () => {
      const fullPath = path.join(LOCAL_DIR, key);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, buffer);
    })(),
    STORAGE_TIMEOUT_MS,
  );
}

async function get(key: string): Promise<Buffer> {
  return fs.readFile(path.join(LOCAL_DIR, key));
}

async function remove(key: string): Promise<void> {
  await fs.rm(path.join(LOCAL_DIR, key), { force: true });
}

module.exports = { put, get, remove, StorageUnavailableError, StorageTimeoutError };
