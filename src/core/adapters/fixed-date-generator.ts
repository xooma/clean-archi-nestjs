import { AbstractDateGenerator } from '../ports';

export class FixedDateGenerator implements AbstractDateGenerator {
  now(): Date {
    return new Date('2023-01-01T00:00:00Z');
  }
}