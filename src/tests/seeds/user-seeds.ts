import { UserFixture } from '../fixtures/user.fixture';
import { User } from '../../users/entities/user.entity';

export const e2eUsers = {
  johnDoe: new UserFixture(
    new User({
      id: 'john-doe',
      email: 'johndoe@gmail.com',
      password: 'azerty',
    })
  )
}