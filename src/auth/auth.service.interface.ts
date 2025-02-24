import { user } from '@prisma/client';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';

export interface JWTPayloadInterface {
  id: string;
  email: string;
  name: string;
}

export interface AuthServiceInterface {
  register: (data: RegisterDTO) => Promise<Pick<user, 'id' | 'email' | 'name'>>;
  login: (data: LoginDTO) => Promise<{
    user: Pick<user, 'id' | 'email' | 'name'>;
    access_token: string;
    refresh_token: string;
  }>;
}
