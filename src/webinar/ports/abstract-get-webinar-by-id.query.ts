import { WebinarDTO } from '../dtos/webinar.dto';

export abstract class AbstractGetWebinarByIdQuery {
  abstract execute(id: string): Promise<WebinarDTO>;
}