export class WebinarNotFoundException extends Error {
  constructor() {
    super(`Webinar not found`);
  }
}