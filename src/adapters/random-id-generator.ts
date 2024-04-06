import { v4 } from 'uuid';
import { IIDGenerator } from '../ports';

export class RandomIdGenerator implements IIDGenerator {
  generate(): string {
    return v4();
  }
}