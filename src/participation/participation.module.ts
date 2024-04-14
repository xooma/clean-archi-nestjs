import { Module } from '@nestjs/common';
import { AbstractParticipationRepository } from './ports/abstract-participation-repository';
import { InMemoryParticipationRepository } from './adapters/in-memory-participation-repository';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoParticipation } from './adapters/mongo/mongo-participation';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MongoParticipation.CollectionName, schema: MongoParticipation.Schema }]),
  ],
  providers: [
    {
      provide: AbstractParticipationRepository,
      useClass: InMemoryParticipationRepository,
    },
  ],
  exports: [AbstractParticipationRepository],
})
export class ParticipationModule {}