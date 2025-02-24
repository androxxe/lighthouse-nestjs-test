import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsNumber()
  APP_PORT: number;

  @IsString()
  @IsEnum(['development', 'staging', 'production'])
  APP_ENV: string;

  @IsString()
  DB_HOST: string;

  @IsNumber()
  DB_PORT: number;

  @IsString()
  DB_USER: string;

  @IsString()
  DB_PASS: string;

  @IsString()
  DB_NAME: string;

  @IsString()
  DB_SCHEMA: string;

  @IsNumber()
  DB_CONNECTION_LIMIT: number;

  @IsNumber()
  DB_POOL_TIMEOUT: number;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  JWT_SECRET_KEY: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
