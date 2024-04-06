import { Module } from '@nestjs/common';
import { AbstractDateGenerator, AbstractIDGenerator } from './ports';
import { CurrentDateGenerator, RandomIdGenerator } from './adapters';

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
  ],
  exports: [AbstractIDGenerator, AbstractDateGenerator],
})
export class CommonModule {}