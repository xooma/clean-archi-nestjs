import { DomainException } from '../../shared/exception';

export class WebinarFullException extends DomainException {
  constructor() {
    super('The webinar is already full');
  }
}