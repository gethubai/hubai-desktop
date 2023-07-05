import crypto from 'crypto';

export function generateSecureRandom64ByteKey(): string {
  return crypto.randomBytes(64).toString('hex');
}
