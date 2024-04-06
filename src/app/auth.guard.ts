import { CanActivate, ExecutionContext } from '@nestjs/common';
import { IAuthenticator } from '../services/authenticator';
import { extractToken } from './extract-token';

export class AuthGuard implements CanActivate {
  constructor(private readonly authenticator: IAuthenticator) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (!authorization) return false;

    const token = extractToken(authorization);

    if (!token) return false;

    try {
      const user = await this.authenticator.authenticate(token);
      request.user = user;
      return true;
    } catch (error) {
      return false;
    }
  }
}