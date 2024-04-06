import { AbstractDateGenerator } from '../ports';

export class CurrentDateGenerator implements AbstractDateGenerator {
  now(): Date {
    return new Date();
  }
}