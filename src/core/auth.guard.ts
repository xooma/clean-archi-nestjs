import { CanActivate, ExecutionContext } from '@nestjs/common';
import { IAuthenticator } from './services/authenticator';
import { extractToken } from './utils/extract-token';

export class AuthGuard implements CanActivate {
  constructor(private readonly authenticator: IAuthenticator) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (!authorization) return false;

    const token = extractToken(authorization);

    if (!token) return false;

    try {
      request.user = await this.authenticator.authenticate(token);
      return true;
    } catch (error) {
      return false;
    }
  }
}