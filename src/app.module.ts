import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { validate } from 'config/env.validation';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      load: [configuration],
    }),
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
