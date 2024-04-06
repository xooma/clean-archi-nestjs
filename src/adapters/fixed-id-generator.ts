import { IIDGenerator } from '../ports';

export class FixedIDGenerator implements IIDGenerator {
  generate() {
    return 'id-1';
  }
}