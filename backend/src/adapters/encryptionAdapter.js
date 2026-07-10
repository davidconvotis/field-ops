const crypto = require('crypto');

class EncryptionUnavailableError extends Error {
  constructor(message) {
    super(message);
    this.name = 'EncryptionUnavailableError';
  }
}

/**
 * NFR-02/02b: cifrado AES-256 en reposo para fotos de evidencia.
 * Prod: envelope encryption vía KMS real (fuera de alcance de este slice).
 * Dev/test: AES-256-GCM local con clave desde ENCRYPTION_DATA_KEY (nunca en el repo).
 * Si el "KMS" falla, se lanza EncryptionUnavailableError -> el caller aborta la
 * escritura completa con 503, nunca persiste en claro como fallback (NFR-02b).
 */
function encryptBuffer(buffer) {
  if (process.env.KMS_SIMULATE_FAILURE === 'true') {
    throw new EncryptionUnavailableError('KMS no disponible (simulado)');
  }
  const keyHex = process.env.ENCRYPTION_DATA_KEY;
  if (!keyHex || keyHex.length !== 64) {
    throw new EncryptionUnavailableError('ENCRYPTION_DATA_KEY ausente o con longitud inválida');
  }
  const key = Buffer.from(keyHex, 'hex');
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]);
}

function decryptBuffer(payload) {
  const keyHex = process.env.ENCRYPTION_DATA_KEY;
  const key = Buffer.from(keyHex, 'hex');
  const iv = payload.subarray(0, 12);
  const authTag = payload.subarray(12, 28);
  const encrypted = payload.subarray(28);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]);
}

module.exports = { encryptBuffer, decryptBuffer, EncryptionUnavailableError };
