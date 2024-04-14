import { AbstractWebinarRepository } from '../../ports/abstract-webinar-repository';
import { Model } from 'mongoose';
import { MongoWebinar } from './mongo-webinar';
import { Webinar } from '../../entities/webinar.entity';
import { diff } from 'deep-object-diff';
import { WebinarMapper } from './webinar.mapper';

export class MongoWebinarRepository implements AbstractWebinarRepository {
  private readonly webinarMapper = new WebinarMapper();

  constructor(private readonly model: Model<MongoWebinar.SchemaClass>) {}

  async create(webinar: Webinar): Promise<void> {
    const record = new this.model(this.webinarMapper.toPeristence(webinar));

    await record.save();
  }

  async delete(webinar: Webinar): Promise<void> {
    const record = await this.model.findById(webinar.props.id);

    if (!record) return;

    await record.deleteOne();
  }

  async findById(id: string): Promise<Webinar | null> {
    const webinar = await this.model.findOne({ _id: id });

    if (!webinar) {
      return null;
    }

    return this.webinarMapper.toDomain(webinar);
  }

  async update(webinar: Webinar): Promise<void> {
    const record = await this.model.findById(webinar.props.id);

    if (!record) return;

    const objectDifferences = diff(webinar.initialProps, webinar.props);

    await this.model.updateOne(objectDifferences);
  }
}