import { Module } from '@nestjs/common';

import { CoreController } from './core.controller';
import { CoreService } from './core.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { Authenticator } from './services/authenticator';
import { CommonModule } from './common.module';
import { AbstractUserRepository } from '../user/ports/abstract-user-repository';
import { WebinarsModule } from '../webinar/webinars.module';
import { UsersModule } from '../user/users.module';
import { ParticipationModule } from '../participation/participation.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
      })
    }),
    CommonModule,
    WebinarsModule,
    UsersModule,
    ParticipationModule,
  ],
  controllers: [CoreController],
  providers: [
    CoreService,
    {
      provide: Authenticator,
      inject: [AbstractUserRepository],
      useFactory: (userRepository) => new Authenticator(userRepository),
    },
    {
      provide: APP_GUARD,
      inject: [Authenticator],
      useFactory: (authenticator) => new AuthGuard(authenticator),
    },
  ],
})
export class CoreModule {}
