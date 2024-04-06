import { AbstractIDGenerator } from '../ports';

export class FixedIDGenerator implements AbstractIDGenerator {
  generate() {
    return 'id-1';
  }
}