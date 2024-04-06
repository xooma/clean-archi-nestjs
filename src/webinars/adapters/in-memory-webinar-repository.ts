import { AbstractWebinarRepository } from '../ports/abstract-webinar-repository';
import { Webinar } from '../entities/webinar.entity';

export class InMemoryWebinarRepository implements AbstractWebinarRepository {
  constructor(public database: Webinar[] = []) {
  }

  async findById(id: string): Promise<Webinar | null> {
    return this.database.find((webinar) => webinar.props.id === id) || null;
  }

  async create(webinar: Webinar): Promise<void> {
    this.database.push(webinar);
  }
}