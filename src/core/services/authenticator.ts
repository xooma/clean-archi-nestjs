import { AbstractUserRepository } from '../../users/ports/abstract-user-repository';
import { User } from '../../users/entities/user.entity';

export interface IAuthenticator {
  authenticate(token: string): Promise<User>;
}

export class Authenticator implements IAuthenticator {
  constructor(private userRepository: AbstractUserRepository) {}

  async authenticate(token: string): Promise<User> {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [email, password] = decoded.split(':');

    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new Error('User not found');

    if (user.props.password !== password) throw new Error('Password invalid');

    return user;
  }
}