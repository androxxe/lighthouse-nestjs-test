import { Test, TestingModule } from '@nestjs/testing';
import { TaskGateway } from './task.gateway';
import { TaskService } from './task.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

describe('TaskGateway', () => {
  let gateway: TaskGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, JwtModule],
      providers: [TaskGateway, TaskService],
    }).compile();

    gateway = module.get<TaskGateway>(TaskGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
