import { Model } from 'mongoose';

import { AbstractUserRepository } from '../../ports/abstract-user-repository';
import { User } from '../../entities/user.entity';

import { MongoUser } from './mongo-user';
import { UserMapper } from './user.mapper';

export class MongoUserRepository implements AbstractUserRepository {
  private mapper = new UserMapper();

  constructor(private readonly model: Model<MongoUser.SchemaClass>) {}

  async create(user: User): Promise<void> {
    const record = new this.model(this.mapper.toPersistence(user));

    await record.save();
  }

  async findById(userId: string): Promise<User | null> {
    const user = await this.model.findOne({ _id: userId });

    if (!user) {
      return null;
    }

    return this.mapper.toDomain(user);
  }

  async findByEmailAdress(email: string): Promise<User | null> {
    const user = await this.model.findOne({ emailAdress: email });

    if (!user) {
      return null;
    }

    return this.mapper.toDomain(user);
  }
}