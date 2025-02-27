import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { RequestUserInterface } from './user.interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  getProfile(@Request() req: RequestUserInterface) {
    return this.userService.getProfile(req.user.email);
  }
}
