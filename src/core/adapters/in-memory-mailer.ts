import { Email } from '../ports/abstract-mailer';

export class InMemoryMailer {
  public readonly sentEmails: Email[] = [];

  async send(email: Email): Promise<void> {
    this.sentEmails.push(email);
  }
}