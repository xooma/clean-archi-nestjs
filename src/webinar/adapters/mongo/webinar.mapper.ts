import { Webinar } from '../../entities/webinar.entity';
import { MongoWebinar } from './mongo-webinar';

export class WebinarMapper {
  toDomain(mongoWebinar: MongoWebinar.Document): Webinar {
    return new Webinar({
      id: mongoWebinar._id,
      organizerId: mongoWebinar.organizerId,
      title: mongoWebinar.title,
      seats: mongoWebinar.seats,
      startDate: mongoWebinar.startDate,
      endDate: mongoWebinar.endDate,
    });
  }

  toPeristence(webinar: Webinar): MongoWebinar.SchemaClass {
    return {
      _id: webinar.props.id,
      organizerId: webinar.props.organizerId,
      title: webinar.props.title,
      seats: webinar.props.seats,
      startDate: webinar.props.startDate,
      endDate: webinar.props.endDate,
    };
  }
}