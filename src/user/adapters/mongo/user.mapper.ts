import { MongoUser } from './mongo-user';
import { User } from '../../entities/user.entity';

export class UserMapper {
  toDomain(user: MongoUser.Document): User {
    return new User({
      id: user._id,
      emailAdress: user.emailAdress,
      password: user.password,
    });
  }

  toPersistence(user: User): MongoUser.SchemaClass {
    return {
      _id: user.props.id,
      emailAdress: user.props.emailAdress,
      password: user.props.password,
    };
  }
}