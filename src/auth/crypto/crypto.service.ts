import { Injectable } from '@nestjs/common';
import { hash, compare, genSalt } from 'bcrypt';
import { CryptoServiceInterface } from './crypto.service.interface';

const SALT_ROUNDS = 10;

@Injectable()
export class CryptoService implements CryptoServiceInterface {
  async hash(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      genSalt(SALT_ROUNDS, function (err, salt) {
        if (err) {
          return reject(err);
        }

        hash(password, salt, (err: unknown, hash: string) => {
          if (err) {
            reject(err);
          }
          resolve(hash);
        });
      });
    });
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      compare(password, hash, (err: unknown, isMatch: boolean) => {
        if (err) {
          reject(err);
        }

        resolve(isMatch);
      });
    });
  }
}
