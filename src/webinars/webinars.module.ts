import { Module } from '@nestjs/common';
import { WebinarController } from './controllers/webinars.controller';
import { AbstractWebinarRepository } from './ports/abstract-webinar-repository';
import { InMemoryWebinarRepository } from './adapters/in-memory-webinar-repository';
import { AbstractDateGenerator, AbstractIDGenerator } from '../core/ports';
import { OrganizeWebinar } from './usecases';
import { CommonModule } from '../core/common.module';

@Module({
  imports: [CommonModule],
  controllers: [WebinarController],
  providers: [
    {
      provide: AbstractWebinarRepository,
      useClass: InMemoryWebinarRepository,
    },
    {
      provide: OrganizeWebinar,
      inject: [
        AbstractWebinarRepository,
        AbstractIDGenerator,
        AbstractDateGenerator,
      ],
      useFactory: (webinarRepository, idGenerator, dateGenerator) =>
        new OrganizeWebinar(webinarRepository, idGenerator, dateGenerator),
    },
  ],
  exports: [AbstractWebinarRepository],
})
export class WebinarsModule {}