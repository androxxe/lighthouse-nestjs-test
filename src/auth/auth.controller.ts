import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDTO } from './dto/register.dto';
import { AuthService } from './auth.service';
import { CryptoService } from './crypto/crypto.service';
import { LoginDTO } from './dto/login.dto';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly cryptoService: CryptoService) {}

  @Post('register')
  async register(@Body() body: RegisterDTO) {
    const user = await this.authService.register(body);

    return {
      message: 'User registered successfully',
      data: {
        email: user.email,
      },
    };
  }

  @Post('login')
  login(@Body() body: LoginDTO) {
    return this.authService.login(body);
  }
}
