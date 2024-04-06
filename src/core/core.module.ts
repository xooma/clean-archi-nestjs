import { Module } from '@nestjs/common';

import { CoreController } from './core.controller';
import { CoreService } from './core.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { Authenticator } from './services/authenticator';
import { AbstractUserRepository } from '../users/ports/abstract-user-repository';
import { WebinarsModule } from '../webinars/webinars.module';
import { UsersModule } from '../users/users.module';
import { CommonModule } from './common.module';

@Module({
  imports: [CommonModule, WebinarsModule, UsersModule],
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
