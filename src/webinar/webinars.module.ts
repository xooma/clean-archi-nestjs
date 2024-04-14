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
import { ReserveSeat } from './usecases/reserve-seat';
import { CancelSeat } from './usecases/cancel-seat';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { MongoWebinar } from './adapters/mongo/mongo-webinar';
import { MongoWebinarRepository } from './adapters/mongo/mongo-webinar-repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MongoWebinar.CollectionName, schema: MongoWebinar.Schema }]),
    CommonModule,
    UsersModule,
    ParticipationModule,
  ],
  controllers: [WebinarController],
  providers: [
    {
      provide: AbstractWebinarRepository,
      inject: [getModelToken(MongoWebinar.CollectionName)],
      useFactory: (model) => new MongoWebinarRepository(model),
    },
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
    {
      provide: ReserveSeat,
      inject: [AbstractParticipationRepository, AbstractWebinarRepository, AbstractUserRepository, AbstractMailer],
      useFactory: (participationRepository, webinarRepository, userRepository, mailer) =>
        new ReserveSeat(participationRepository, webinarRepository, userRepository, mailer),
    },
    {
      provide: CancelSeat,
      inject: [AbstractParticipationRepository, AbstractWebinarRepository, AbstractUserRepository, AbstractMailer],
      useFactory: (participationRepository, webinarRepository, userRepository, mailer) =>
        new CancelSeat(participationRepository, webinarRepository, userRepository, mailer),
    },
  ],
  exports: [AbstractWebinarRepository],
})
export class WebinarsModule {}
