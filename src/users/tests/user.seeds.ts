import { User } from '../entities/user.entity';

export const testUsers = {
  aliceFoo: new User({
    id: 'alice-foo',
    email: 'alicefoo@gmail.com',
    password: 'azerty',
  }),
  billyBob: new User({
    id: 'billy-bob',
    email: 'billybob@gmail.com',
    password: 'azerty',
  }),
};
