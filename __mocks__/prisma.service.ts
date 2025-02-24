// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PrismaService } from '../src/prisma/prisma.service';

export const prismaMock = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};
