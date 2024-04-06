import { IDateGenerator } from '../ports';

export class FixedDateGenerator implements IDateGenerator {
  now(): Date {
    return new Date('2024-01-01T00:00:00Z');
  }
}