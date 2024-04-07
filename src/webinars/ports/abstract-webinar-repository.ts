import { Webinar } from '../entities/webinar.entity';

export abstract class AbstractWebinarRepository {
  abstract findById(id: string): Promise<Webinar | null>;
  abstract create(webinar: Webinar): Promise<void>;
  abstract update(webinar: Webinar): Promise<void>;
}