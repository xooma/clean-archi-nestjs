import { User } from '../entities/user.entity';
import { AbstractUserRepository } from '../ports/abstract-user-repository';

export class InMemoryUserRepository implements AbstractUserRepository {
  constructor(public readonly database: User[] = []) {}

  async create(user: User): Promise<void> {
    this.database.push(user);
  }

  async findByEmailAdress(email: string): Promise<User | null> {
    const user = this.database.find((user) => user.props.emailAdress === email);

    return user ? new User(user.initialProps) : null;
  }

  async findById(userId: string): Promise<User | null> {
    const user = this.database.find((user) => user.props.id === userId);

    return user ? new User(user.initialProps) : null;
  }
}