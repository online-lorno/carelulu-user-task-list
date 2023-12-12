import * as crypto from 'crypto';

export const hashPassword = (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Generate a random salt
    const salt = crypto.randomBytes(16).toString('hex');

    // Hash the password using PBKDF2
    crypto.pbkdf2(password, salt, 10000, 64, 'sha512', (err, derivedKey) => {
      if (err) {
        reject(err);
      } else {
        resolve(salt + ':' + derivedKey.toString('hex'));
      }
    });
  });
};

export const verifyPassword = (
  hash: string,
  password: string,
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    // Extract the salt and the password hash from the combined hash
    const [salt, originalHash] = hash.split(':');

    // Hash the password using PBKDF2
    crypto.pbkdf2(password, salt, 10000, 64, 'sha512', (err, derivedKey) => {
      if (err) {
        reject(err);
      } else {
        resolve(originalHash === derivedKey.toString('hex'));
      }
    });
  });
};
