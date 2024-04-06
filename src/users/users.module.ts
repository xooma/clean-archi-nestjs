import { Module } from '@nestjs/common';
import { AbstractUserRepository } from './ports/abstract-user-repository';
import { InMemoryUserRepository } from './adapters/in-memory-user-repository';

@Module({
  providers: [
    {
      provide: AbstractUserRepository,
      useFactory: () => new InMemoryUserRepository(),
    },
  ],
  exports: [AbstractUserRepository],
})
export class UsersModule {}