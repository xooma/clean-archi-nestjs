import { Authenticator } from './authenticator';
import { InMemoryUserRepository } from '../../user/adapters/in-memory-user-repository';
import { User } from '../../user/entities/user.entity';
import { DomainException } from '../../shared/exception';

describe('Authenticator', () => {
  let repository: InMemoryUserRepository;
  let authenticator: Authenticator;

  beforeEach(async () => {
    repository = new InMemoryUserRepository();
    await repository.create(
      new User({
        id: 'id-1',
        emailAdress: 'johndoe@gmail.com',
        password: 'azerty',
      }),
    );

    authenticator = new Authenticator(repository);
  });

  describe('Case: the token is valid', () => {
    it('it should return the user', async () => {
      const payload = Buffer.from('johndoe@gmail.com:azerty').toString(
        'base64',
      );
      const user = await authenticator.authenticate(payload);

      expect(user.props).toEqual({
        id: 'id-1',
        emailAdress: 'johndoe@gmail.com',
        password: 'azerty',
      });
    });
  });

  describe('Case: the user does not exist', () => {
    it('should fail', async () => {
      const payload = Buffer.from('unknown@gmail.com:azerty').toString(
        'base64',
      );

      await expect(() => authenticator.authenticate(payload)).rejects.toThrow(
        new DomainException('User not found'),
      );
    });
  });

  describe('Case: the password is not valid', () => {
    it('should fail', async () => {
      const payload = Buffer.from('johndoe@gmail.com:notValid').toString(
        'base64',
      );

      await expect(() => authenticator.authenticate(payload)).rejects.toThrow(
        new DomainException('Password invalid'),
      );
    });
  });
});
