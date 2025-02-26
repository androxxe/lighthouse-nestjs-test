import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDTO } from './dto/create-project.dto';
import { UpdateProjectDTO } from './dto/update-project.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProjectServiceInterface } from './prisma.service.interface';

@Injectable()
export class ProjectService implements ProjectServiceInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateProjectDTO) {
    const count = await this.prismaService.projects.count();

    if (count >= 10) {
      throw new ForbiddenException('You can only create 10 projects');
    }

    return this.prismaService.projects.create({
      data,
      select: {
        id: true,
        name: true,
      },
    });
  }

  findAll() {
    return this.prismaService.projects.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async update(id: string, data: UpdateProjectDTO) {
    const project = await this.prismaService.projects.findUnique({
      where: {
        id,
      },
    });

    if (!project) throw new NotFoundException('Project not found');

    return this.prismaService.projects.update({
      where: {
        id,
      },
      data,
      select: {
        id: true,
        name: true,
      },
    });
  }

  async remove(id: string) {
    const project = await this.prismaService.projects.findUnique({
      where: {
        id,
      },
    });

    if (!project) throw new NotFoundException('Project not found');

    return this.prismaService.projects.delete({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
      },
    });
  }
}
