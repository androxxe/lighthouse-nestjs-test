import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RegisterDTO } from './dto/register.dto';
import { AuthService } from './auth.service';
import { CryptoService } from './crypto/crypto.service';
import { LoginDTO } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

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
  async login(@Body() body: LoginDTO) {
    const data = await this.authService.login(body);

    return {
      message: 'User logged in successfully',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('validate')
  async validate() {
    return {
      message: 'Token valid',
      data: null,
    };
  }
}
