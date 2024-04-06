import { IUserRepository } from '../ports';
import { User } from '../entities';

export class InMemoryUserRepository implements IUserRepository {
  private database: User[] = [];

  async create(user: User): Promise<void> {
    this.database.push(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.database.find((user) => user.props.email === email);

    return user ?? null;
  }
}