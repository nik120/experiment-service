import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

/**
 * Handles the core A/B assignment logic.
 * Responsible for deterministically assigning a user to a variant.
 */
@Injectable()
export class ExperimentService {

  /**
   * Returns variant 'A' or 'B' for a given user.
   *
   * How it works:
   * 1. Hash the userId using SHA-256
   * 2. Take the first 8 characters of the hash and convert to a number
   * 3. Even number → variant A, Odd number → variant B
   *
   * Why this is deterministic:
   * SHA-256 always produces the same output for the same input.
   * So the same userId will always get the same variant — across
   * requests, restarts, and deployments.
   */
  getVariant(userId: string): string {
    const hash = crypto
      .createHash('sha256')
      .update(userId)
      .digest('hex');

    const num = parseInt(hash.substring(0, 8), 16);

    return num % 2 === 0 ? 'A' : 'B';
  }
}