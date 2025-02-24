import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaService } from 'src/prisma/prisma.service';

@ValidatorConstraint({ name: 'isUserAlreadyExist', async: true })
export class IsUserAlreadyExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async validate(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    return !user;
  }

  defaultMessage() {
    return 'Email already registered';
  }
}

export function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserAlreadyExistConstraint,
    });
  };
}
