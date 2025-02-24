import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RequestUserInterface } from './user.interface';

@UseGuards(JwtAuthGuard)
@Controller('v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  getProfile(@Request() req: RequestUserInterface) {
    return this.userService.getProfile(req.user.email);
  }
}
