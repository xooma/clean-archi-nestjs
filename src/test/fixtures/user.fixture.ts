import { TestApp } from '../utils/test-app';
import { IFixture } from '../utils/fixture.interface';
import { AbstractUserRepository } from '../../user/ports/abstract-user-repository';
import { User } from '../../user/entities/user.entity';

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
