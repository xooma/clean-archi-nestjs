export type Email = {
  to: string;
  subject: string;
  body: string;
}

export abstract class AbstractMailer {
  abstract send(email: Email): Promise<void>;
}