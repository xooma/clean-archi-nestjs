import { Prop, Schema as MongooseSchema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Participation } from '../../entities/participation.entity';

export namespace MongoParticipation {
  export const CollectionName = 'participations';

  @MongooseSchema({ collection: CollectionName })
  export class SchemaClass {
    @Prop({ type: String })
    _id: string;

    @Prop()
    userId: string;

    @Prop()
    webinarId: string;

    static makeId(participation: Participation) {
      return `${participation.props.userId}:${participation.props.webinarId}`;
    }
  }

  export const Schema = SchemaFactory.createForClass(SchemaClass);
  export type Document = HydratedDocument<SchemaClass>;
}