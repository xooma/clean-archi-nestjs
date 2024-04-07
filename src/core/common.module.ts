import { Module } from '@nestjs/common';
import { AbstractDateGenerator, AbstractIDGenerator } from './ports';
import { CurrentDateGenerator, RandomIdGenerator } from './adapters';
import { AbstractMailer } from './ports/abstract-mailer';
import { InMemoryMailer } from './adapters/in-memory-mailer';

@Module({
  providers: [
    {
      provide: AbstractIDGenerator,
      useClass: RandomIdGenerator,
    },
    {
      provide: AbstractDateGenerator,
      useClass: CurrentDateGenerator,
    },
    {
      provide: AbstractMailer,
      useClass: InMemoryMailer,
    }
  ],
  exports: [AbstractIDGenerator, AbstractDateGenerator, AbstractMailer],
})
export class CommonModule {}