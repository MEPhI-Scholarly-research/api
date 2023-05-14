import * as CryptoJS from 'crypto-js';
import { PASSWORD_HASH_KEY_SIZE } from "../constants"


export class Password {
  static hash(password: string, salt: string, iterations: number): string {
    return CryptoJS.PBKDF2(password, salt, {
      keySize: PASSWORD_HASH_KEY_SIZE,
      hasher: CryptoJS.algo.SHA256,
      iterations: iterations
    }).toString();
  }

  static check(password: string, salt: string, iterations: number, hash: string): boolean {
    var hash_ = CryptoJS.PBKDF2(password, salt, {
      keySize: PASSWORD_HASH_KEY_SIZE,
      hasher: CryptoJS.algo.SHA256,
      iterations: iterations
    }).toString();
    return hash_ == hash
  }
}
