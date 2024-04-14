import { User } from '../entities/user.entity';

export const testUsers = {
  aliceFoo: new User({
    id: 'alice-foo',
    emailAdress: 'alicefoo@gmail.com',
    password: 'azerty',
  }),
  billyBob: new User({
    id: 'billy-bob',
    emailAdress: 'billybob@gmail.com',
    password: 'azerty',
  }),
  charlesCat: new User({
    id: 'charles-cat',
    emailAdress: 'charlescat@gmail.com',
    password: 'caterty'
  })
};
