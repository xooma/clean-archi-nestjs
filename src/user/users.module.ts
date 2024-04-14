import { Module } from '@nestjs/common';
import { AbstractUserRepository } from './ports/abstract-user-repository';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { MongoUser } from './adapters/mongo/mongo-user';
import { MongoUserRepository } from './adapters/mongo/mongo-user-repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: MongoUser.CollectionName, schema: MongoUser.Schema }])],
  providers: [
    {
      provide: AbstractUserRepository,
      inject: [getModelToken(MongoUser.CollectionName)],
      useFactory: (model) => new MongoUserRepository(model),
    },
  ],
  exports: [AbstractUserRepository],
})
export class UsersModule {}
