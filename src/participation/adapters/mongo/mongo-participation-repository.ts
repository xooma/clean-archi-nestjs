import { Model } from 'mongoose';
import { MongoParticipation } from './mongo-participation';
import { AbstractParticipationRepository } from '../../ports/abstract-participation-repository';
import { Participation } from '../../entities/participation.entity';

export class MongoParticipationRepository implements AbstractParticipationRepository {
  constructor(private readonly model: Model<MongoParticipation.SchemaClass>) {}

  countParticipations(webinarId: string): Promise<number> {
    return this.model.countDocuments({ webinarId });
  }

  async create(participation: Participation): Promise<void> {
    const record = new this.model({
      _id: MongoParticipation.SchemaClass.makeId(participation),
      userId: participation.props.userId,
      webinarId: participation.props.webinarId,
    });

    await record.save();
  }

  async delete(participation: Participation): Promise<void> {
    const record = this.model.findById(MongoParticipation.SchemaClass.makeId(participation));

    return record.deleteOne();
  }

  async findByWebinarId(webinarId: string): Promise<Participation[]> {
    const participations = await this.model.find({ webinarId });

    return participations.map(
      (participation) =>
        new Participation({
          userId: participation.userId,
          webinarId: participation.webinarId,
        }),
    );
  }

  async findOne(userId: string, webinarId: string): Promise<Participation | null> {
    const record = await this.model.findOne({ userId, webinarId });

    if (!record) {
      return null;
    }

    return new Participation({
      userId: record.userId,
      webinarId: record.webinarId,
    });
  }
}
