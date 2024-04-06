import { User } from '../entities/user.entity';
import { AbstractUserRepository } from '../ports/abstract-user-repository';

export class InMemoryUserRepository implements AbstractUserRepository {
  private database: User[] = [];

  async create(user: User): Promise<void> {
    this.database.push(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.database.find((user) => user.props.email === email);

    return user ?? null;
  }
}