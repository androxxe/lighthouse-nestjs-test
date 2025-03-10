import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { validate } from 'config/env.validation';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { PrismaService } from './prisma/prisma.service';
import { IsForeignKeyExistsConstraint } from './validator/is-foreign-key-exist.validator';
import { ProjectModule } from './project/project.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      load: [configuration],
    }),
    AuthModule,
    UserModule,
    TaskModule,
    ProjectModule,
    CategoryModule,
  ],
  providers: [PrismaService, IsForeignKeyExistsConstraint],
})
export class AppModule {}
