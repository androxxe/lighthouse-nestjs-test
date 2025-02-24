import { JWTPayloadInterface } from 'src/auth/auth.service.interface';

export interface RequestUserInterface extends Request {
  user: JWTPayloadInterface;
}
