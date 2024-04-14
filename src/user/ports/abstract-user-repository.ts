import { User } from '../entities/user.entity';

export abstract class AbstractUserRepository {
  abstract create(user: User): Promise<void>;
  abstract findByEmailAdress(email: string): Promise<User | null>
  abstract findById(userId: string): Promise<User | null>;
}