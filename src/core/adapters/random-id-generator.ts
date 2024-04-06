import { v4 } from 'uuid';
import { AbstractIDGenerator } from '../ports';

export class RandomIdGenerator implements AbstractIDGenerator {
  generate(): string {
    return v4();
  }
}