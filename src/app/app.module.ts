import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CurrentDateGenerator, InMemoryWebinaireRepository, RandomIdGenerator } from '../adapters';
import { OrganizeWebinaire } from '../usecases/organize-webinaire';

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
  ],
})
export class AppModule {}
