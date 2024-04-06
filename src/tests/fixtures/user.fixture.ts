import { User } from '../../users/entities/user.entity';
import { TestApp } from '../utils/test-app';
import { AbstractUserRepository } from '../../users/ports/abstract-user-repository';
import { IFixture } from '../utils/fixture.interface';

export class UserFixture implements IFixture {
  constructor(public entity: User) {}

  async load(app: TestApp): Promise<void> {
    const repository = app.get<AbstractUserRepository>(AbstractUserRepository);
    await repository.create(this.entity);
  }

  createAuthorizationToken(): string {
    return `Basic ${Buffer.from(
      `${this.entity.props.email}:${this.entity.props.password}`,
    ).toString('base64')}`;
  }
}
