import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class JwtAuthWsGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient();
    const authHeader = client.handshake.headers.authorization;

    if (!authHeader) {
      throw new WsException('Unauthorized');
    }

    let token: string | undefined;
    try {
      const split = authHeader.split(' ');
      const bearer = split[0];
      token = split[1];

      if (bearer !== 'Bearer' || !token) {
        throw new WsException('Unauthorized');
      }
    } catch (e) {
      throw new WsException('Unauthorized');
    }

    try {
      this.jwtService.verify(token);

      return true;
    } catch (e) {
      throw new WsException('Invalid token');
    }
  }
}
