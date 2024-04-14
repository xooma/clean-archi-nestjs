import { AbstractUserRepository } from '../../ports/abstract-user-repository';
import { User } from '../../entities/user.entity';
import { Model, Promise } from 'mongoose';
import { MongoUser } from './mongo-user';

export class MongoUserRepository implements AbstractUserRepository {
  constructor(private readonly model: Model<MongoUser.SchemaClass>) {}

  async create(user: User): Promise<void> {
    const record = new this.model({
      _id: user.props.id,
      emailAdress: user.props.emailAdress,
      password: user.props.password,
    });

    await record.save();
  }

  async findByEmailAdress(email: string): Promise<User | null> {
    const user = await this.model.findOne({ emailAdress: email });

    if (!user) {
      return null;
    }

    return new User({
      id: user._id,
      emailAdress: user.emailAdress,
      password: user.password,
    });
  }

  async findById(userId: string): Promise<User | null> {
    const user = await this.model.findOne({ _id: userId });

    if (!user) {
      return null;
    }

    return new User({
      id: user._id,
      emailAdress: user.emailAdress,
      password: user.password,
    });
  }
}