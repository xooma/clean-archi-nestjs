export class WebinarImminentException extends Error {
  constructor() {
    super('The webinar must happen at least 3 days from now');
  }
}