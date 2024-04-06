import { Authenticator } from './authenticator';
import { InMemoryUserRepository } from '../adapters';
import { User } from '../entities';

describe('Authenticator', () => {
  let repository: InMemoryUserRepository;
  let authenticator: Authenticator;

  beforeEach(async () => {
    repository = new InMemoryUserRepository();
    await repository.create(new User({
      id: 'id-1',
      email: 'johndoe@gmail.com',
      password: 'azerty',
    }))

    authenticator = new Authenticator(repository);
  });

  describe('Case: the token is valid', () => {
    it('it should return the user', async () => {
      const payload = Buffer.from('johndoe@gmail.com:azerty').toString('base64');
      const user = await authenticator.authenticate(payload);


      expect(user.props).toEqual({
        id: 'id-1',
        email: 'johndoe@gmail.com',
        password: 'azerty',
      })
    });
  })

  describe('Case: the user does not exist', () => {
    it('it should fail if the user does not exist', async () => {
      const payload = Buffer.from('unknown@gmail.com:azerty').toString('base64');

      await expect(() => authenticator.authenticate(payload)).rejects.toThrow('User not found')
    });
  });

  describe('Case: the password is not valid', () => {
    it('it should fail if the user does not exist', async () => {
      const payload = Buffer.from('johndoe@gmail.com:notValid').toString('base64');

      await expect(() => authenticator.authenticate(payload)).rejects.toThrow('Password invalid')
    });
  });
});