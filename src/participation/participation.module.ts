import { Module } from '@nestjs/common';
import { AbstractParticipationRepository } from './ports/abstract-participation-repository';
import { InMemoryParticipationRepository } from './adapters/in-memory-participation-repository';

@Module({
  providers: [
    {
      provide: AbstractParticipationRepository,
      useClass: InMemoryParticipationRepository,
    },
  ],
  exports: [AbstractParticipationRepository],
})
export class ParticipationModule {}