import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { UpdateCategoryDTO } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryServiceInterface } from './category.service.interface';

@Injectable()
export class CategoryService implements CategoryServiceInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateCategoryDTO) {
    const count = await this.prismaService.categories.count();

    if (count >= 5) {
      throw new ForbiddenException('You can only create 5 categories');
    }

    return this.prismaService.categories.create({
      data,
      select: {
        id: true,
        name: true,
      },
    });
  }

  findAll() {
    return this.prismaService.categories.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        created_at: 'asc',
      },
    });
  }

  async update(id: string, data: UpdateCategoryDTO) {
    const category = await this.prismaService.categories.findUnique({
      where: {
        id,
      },
    });

    if (!category) throw new NotFoundException('Category not found');

    return this.prismaService.categories.update({
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
    const category = await this.prismaService.categories.findUnique({
      where: {
        id,
      },
    });

    if (!category) throw new NotFoundException('Category not found');

    return this.prismaService.categories.delete({
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
