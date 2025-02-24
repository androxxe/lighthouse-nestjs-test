import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDTO } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthServiceInterface, JWTPayloadInterface } from './auth.service.interface';
import { LoginDTO } from './dto/login.dto';
import { CryptoService } from './crypto/crypto.service';
import { JwtService } from '@nestjs/jwt';
import { excludeKeys } from 'src/utils/exclude';

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly cryptoService: CryptoService
  ) {}

  async register(data: RegisterDTO) {
    return this.prismaService.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: await this.cryptoService.hash(data.password),
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  }

  async login(data: LoginDTO) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: data.email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const password = await this.cryptoService.compare(data.password, user.password);

    if (!password) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const payload: JWTPayloadInterface = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: '2h',
    });

    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: '360d',
    });

    return {
      user: excludeKeys(user, ['password']),
      access_token,
      refresh_token,
    };
  }
}
