import { AbstractGetWebinarByIdQuery } from '../../ports/abstract-get-webinar-by-id.query';
import { WebinarDTO } from '../../dtos/webinar.dto';
import { Model } from 'mongoose';
import { MongoWebinar } from './mongo-webinar';
import { MongoParticipation } from '../../../participation/adapters/mongo/mongo-participation';
import { MongoUser } from '../../../user/adapters/mongo/mongo-user';
import { NotFoundException } from '@nestjs/common';

export class MongoGetWebinarByIdQuery implements AbstractGetWebinarByIdQuery {
  constructor(
    private readonly webinarModel: Model<MongoWebinar.SchemaClass>,
    private readonly participationModel: Model<MongoParticipation.SchemaClass>,
    private readonly userModel: Model<MongoUser.SchemaClass>,
  ) {}

  async execute(id: string): Promise<WebinarDTO> {
    const webinar = await this.webinarModel.findById(id);
    if (!webinar) throw new NotFoundException();

    const organizer = await this.userModel.findById(webinar.organizerId);
    if (!organizer) throw new NotFoundException();

    const participationsCount = await this.participationModel.countDocuments({ webinarId: id });

    return {
      id: webinar._id,
      organizer: {
        id: organizer._id,
        emailAddress: organizer.emailAdress,
      },
      title: webinar.title,
      startDate: webinar.startDate,
      endDate: webinar.endDate,
      seats: {
        reserved: participationsCount,
        available: webinar.seats - participationsCount,
      },
    }
  }
}