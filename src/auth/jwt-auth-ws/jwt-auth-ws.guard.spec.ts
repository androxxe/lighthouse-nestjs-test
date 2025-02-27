import { JwtService } from '@nestjs/jwt';
import { JwtAuthWsGuard } from './jwt-auth-ws.guard';

describe('JwtAuthWsGuard', () => {
  it('should be defined', () => {
    expect(new JwtAuthWsGuard(new JwtService())).toBeDefined();
  });
});
