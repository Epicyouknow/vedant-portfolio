import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from 'node:crypto';

function getEncryptionKey(): Buffer {
  const encoded = process.env.GOOGLE_TOKEN_ENCRYPTION_KEY;

  if (!encoded) {
    throw new Error(
      'Missing GOOGLE_TOKEN_ENCRYPTION_KEY'
    );
  }

  const key = Buffer.from(encoded, 'base64');

  if (key.length !== 32) {
    throw new Error(
      'Google token encryption key must be exactly 32 bytes.'
    );
  }

  return key;
}

export function encryptGoogleToken(
  plaintext: string
): string {
  if (!plaintext) {
    throw new Error('Token cannot be empty.');
  }

  const iv = randomBytes(12);

  const cipher = createCipheriv(
    'aes-256-gcm',
    getEncryptionKey(),
    iv
  );

  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return [
    'v1',
    iv.toString('base64url'),
    authTag.toString('base64url'),
    encrypted.toString('base64url'),
  ].join('.');
}

export function decryptGoogleToken(
  payload: string
): string {
  const parts = payload.split('.');

  if (parts.length !== 4 || parts[0] !== 'v1') {
    throw new Error('Invalid encrypted token format.');
  }

  const [, ivEncoded, tagEncoded, dataEncoded] = parts;

  const decipher = createDecipheriv(
    'aes-256-gcm',
    getEncryptionKey(),
    Buffer.from(ivEncoded, 'base64url')
  );

  decipher.setAuthTag(
    Buffer.from(tagEncoded, 'base64url')
  );

  const decrypted = Buffer.concat([
    decipher.update(
      Buffer.from(dataEncoded, 'base64url')
    ),
    decipher.final(),
  ]);

  return decrypted.toString('utf8');
}

