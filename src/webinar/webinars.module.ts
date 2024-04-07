import { Module } from '@nestjs/common';
import { WebinarController } from './controllers/webinars.controller';
import { AbstractWebinarRepository } from './ports/abstract-webinar-repository';
import { InMemoryWebinarRepository } from './adapters/in-memory-webinar-repository';
import { AbstractDateGenerator, AbstractIDGenerator } from '../core/ports';
import { CancelWebinar, ChangeDates, ChangeSeats, OrganizeWebinar } from './usecases';
import { CommonModule } from '../core/common.module';
import { AbstractUserRepository } from '../user/ports/abstract-user-repository';
import { AbstractMailer } from '../core/ports/abstract-mailer';
import { AbstractParticipationRepository } from '../participation/ports/abstract-participation-repository';
import { ParticipationModule } from '../participation/participation.module';
import { UsersModule } from '../user/users.module';

@Module({
  imports: [CommonModule, UsersModule, ParticipationModule],
  controllers: [WebinarController],
  providers: [
    {
      provide: AbstractWebinarRepository,
      useClass: InMemoryWebinarRepository,
    },
    {
      provide: OrganizeWebinar,
      inject: [AbstractWebinarRepository, AbstractIDGenerator, AbstractDateGenerator],
      useFactory: (webinarRepository, idGenerator, dateGenerator) =>
        new OrganizeWebinar(webinarRepository, idGenerator, dateGenerator),
    },
    {
      provide: ChangeSeats,
      inject: [AbstractWebinarRepository],
      useFactory: (webinarRepository) => new ChangeSeats(webinarRepository),
    },
    {
      provide: ChangeDates,
      inject: [
        AbstractWebinarRepository,
        AbstractParticipationRepository,
        AbstractUserRepository,
        AbstractMailer,
        AbstractDateGenerator,
      ],
      useFactory: (webinarRepository, participationRepository, userRepository, mailer, dateGenerator) =>
        new ChangeDates(webinarRepository, participationRepository, userRepository, mailer, dateGenerator),
    },
    {
      provide: CancelWebinar,
      inject: [AbstractWebinarRepository, AbstractParticipationRepository, AbstractUserRepository, AbstractMailer],
      useFactory: (webinarRepository, participationRepository, userRepository, mailer) =>
        new CancelWebinar(webinarRepository, participationRepository, userRepository, mailer),
    },
  ],
  exports: [AbstractWebinarRepository],
})
export class WebinarsModule {}