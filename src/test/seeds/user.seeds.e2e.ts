import { UserFixture } from '../fixtures/user.fixture';
import { User } from '../../user/entities/user.entity';

export const e2eUsers = {
  johnDoe: new UserFixture(
    new User({
      id: 'john-doe',
      email: 'johndoe@gmail.com',
      password: 'azerty',
    })
  ),
  charlesLeclerc: new UserFixture(
    new User({
      id: 'charles-leclerc',
      email: 'charlesleclerc@gmail.com',
      password: 'azerty',
    })
  )
}