import CryptoJS from 'crypto-js';

export const createShortHash = (): string => {
  const randomValue = Math.random().toString(36);
  const sha256Hash = CryptoJS.SHA256(randomValue).toString();
  const shortHash = sha256Hash.substring(0, 6);
  return shortHash;
};
