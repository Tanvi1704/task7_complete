import { createCipheriv, createDecipheriv } from 'crypto';

const IV_HEX = process.env.NEXT_PUBLIC_IV;
const KEY_HEX = process.env.NEXT_PUBLIC_KEY;

if (!IV_HEX || !KEY_HEX) {
  console.error('Missing encryption keys in environment variables.');
}

const IV = IV_HEX ? Buffer.from(IV_HEX, 'hex') : null;
const KEY = KEY_HEX ? Buffer.from(KEY_HEX, 'hex') : null;

export function encrypt(request_data) {
  if (!request_data || !IV || !KEY) return '';
  try {
    const data = typeof request_data === 'object' ? JSON.stringify(request_data) : request_data;
    const cipher = createCipheriv('AES-256-CBC', KEY, IV);
    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  } catch (error) {
    console.error('Encryption Error:', error);
    return '';
  }
}

export function decrypt(request_data) {
  if (!request_data || !IV || !KEY) return {};

  try {
    let encryptedBuffer;

    if (isBase64(request_data)) {
      encryptedBuffer = Buffer.from(request_data, 'base64');
    } else if (isHex(request_data)) {
      encryptedBuffer = Buffer.from(request_data, 'hex');
    } else {
      console.warn('decrypt: Input is neither valid hex nor base64, skipping decryption');
      return tryParseJson(request_data);
    }

    const decipher = createDecipheriv('AES-256-CBC', KEY, IV);
    let decrypted = decipher.update(encryptedBuffer, undefined, 'utf8'); 
    decrypted += decipher.final('utf8');

    return isJson(decrypted) ? JSON.parse(decrypted) : decrypted;
  } catch (error) {
    console.error('Decryption Error:', error);
    return {};
  }
}

function isJson(data) {
  try {
    JSON.parse(data);
    return true;
  } catch {
    return false;
  }
}

function isHex(str) {
  const hexRegex = /^[0-9a-fA-F]+$/;
  return typeof str === 'string' && hexRegex.test(str);
}

function tryParseJson(data) {
  if (isJson(data)) {
    return JSON.parse(data);
  }
  return data;
}

function isBase64(str) {
  if (typeof str !== 'string') return false;
  try {
    return Buffer.from(str, 'base64').toString('base64').replace(/=+$/, '') === str.replace(/=+$/, '');
  } catch {
    return false;
  }
}
