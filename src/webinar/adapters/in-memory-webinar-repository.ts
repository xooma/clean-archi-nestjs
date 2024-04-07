import { AbstractWebinarRepository } from '../ports/abstract-webinar-repository';
import { Webinar } from '../entities/webinar.entity';

export class InMemoryWebinarRepository implements AbstractWebinarRepository {
  constructor(public readonly database: Webinar[] = []) {}

  async findById(id: string): Promise<Webinar | null> {
    const webinar = this.database.find((webinar) => webinar.props.id === id) || null;

    return webinar ? new Webinar(webinar.initialProps) : null;
  }

  async create(webinar: Webinar): Promise<void> {
    this.database.push(webinar);
  }

  async update(webinar: Webinar): Promise<void> {
    const index = this.database.findIndex((w) => w.props.id === webinar.props.id);

    this.database[index] = webinar;
    webinar.commit();
  }

  async delete(webinar: Webinar): Promise<void> {
    const index = this.database.findIndex((w) => w.props.id === webinar.props.id);

    this.database.splice(index, 1);
    webinar.commit();
  }
}