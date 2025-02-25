import { PrismaClient } from '@prisma/client';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

type PrismaModelNames = keyof Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>;

@ValidatorConstraint({ name: 'isForeignKeyExistsConstraint', async: true })
@Injectable()
export class IsForeignKeyExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prismaService: PrismaService) {}

  private getModel(entity: PrismaModelNames) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.prismaService as any)[entity] || null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async validate(value: any, args: ValidationArguments) {
    const [entity, field] = args.constraints as [PrismaModelNames, string];
    const model = this.getModel(entity);

    if (!model) return false;

    const exists = await model.findFirst({
      where: { [field]: value },
    });

    return Boolean(exists);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} does not exist`;
  }
}

export function IsForeignKeyExists(entity: PrismaModelNames, field: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [entity, field],
      validator: IsForeignKeyExistsConstraint,
    });
  };
}
