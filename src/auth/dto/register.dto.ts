import { IsEmail, IsString } from 'class-validator';
import { IsStrongPassword } from '../is-strong-password.validator';
import { IsUserAlreadyExist } from '../is-user-exists.validator';

export class RegisterDTO {
  @IsString()
  name: string;

  @IsUserAlreadyExist()
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
