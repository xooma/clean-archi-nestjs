import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  CurrentDateGenerator,
  InMemoryUserRepository,
  InMemoryWebinaireRepository,
  RandomIdGenerator,
} from '../adapters';
import { OrganizeWebinaire } from '../usecases';
import { Authenticator } from '../services/authenticator';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    InMemoryWebinaireRepository,
    RandomIdGenerator,
    CurrentDateGenerator,
    {
      provide: OrganizeWebinaire,
      inject: [
        InMemoryWebinaireRepository,
        RandomIdGenerator,
        CurrentDateGenerator,
      ],
      useFactory: (
        inMemoryWebinaireRepository,
        randomIdGenerator,
        currentDateGenerator,
      ) =>
        new OrganizeWebinaire(
          inMemoryWebinaireRepository,
          randomIdGenerator,
          currentDateGenerator,
        ),
    },
    InMemoryUserRepository,
    {
      provide: Authenticator,
      inject: [InMemoryUserRepository],
      useFactory: (inMemoryUserRepository) => new Authenticator(inMemoryUserRepository),
    },
    {
      provide: APP_GUARD,
      inject: [Authenticator],
      useFactory: (authenticator) => new AuthGuard(authenticator),
    }
  ],
})
export class AppModule {}
