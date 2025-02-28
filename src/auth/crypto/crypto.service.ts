import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { CryptoServiceInterface } from './crypto.service.interface';

const SALT_ROUNDS = 10;

@Injectable()
export class CryptoService implements CryptoServiceInterface {
  async hash(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(SALT_ROUNDS, async function (err, salt) {
        if (err) {
          return reject(err);
        }

        const result = bcrypt.hashSync(password, salt);

        resolve(result);
      });
    });
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hash, (err: unknown, isMatch: boolean) => {
        if (err) {
          reject(err);
        }

        resolve(isMatch);
      });
    });
  }
}
