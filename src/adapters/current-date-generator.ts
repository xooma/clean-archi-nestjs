import { IDateGenerator } from '../ports';

export class CurrentDateGenerator implements IDateGenerator {
  now(): Date {
    return new Date();
  }
}