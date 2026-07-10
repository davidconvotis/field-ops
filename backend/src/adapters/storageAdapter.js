const fs = require('fs/promises');
const path = require('path');
const { STORAGE_TIMEOUT_MS } = require('../constants');

class StorageUnavailableError extends Error {
  constructor(message) {
    super(message);
    this.name = 'StorageUnavailableError';
  }
}

class StorageTimeoutError extends Error {
  constructor(message) {
    super(message);
    this.name = 'StorageTimeoutError';
  }
}

const LOCAL_DIR = path.join(__dirname, '..', '..', 'storage-local');

function withTimeout(promise, ms) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new StorageTimeoutError(`timeout tras ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

/**
 * NFR-06b: interfaz put/get/delete con timeout explícito.
 * Prod: bucket S3-compatible (fuera de alcance de este slice).
 * Dev/test: filesystem local bajo backend/storage-local/ (gitignored).
 */
async function put(key, buffer) {
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

async function get(key) {
  return fs.readFile(path.join(LOCAL_DIR, key));
}

async function remove(key) {
  await fs.rm(path.join(LOCAL_DIR, key), { force: true });
}

module.exports = { put, get, remove, StorageUnavailableError, StorageTimeoutError };
