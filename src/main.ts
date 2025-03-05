import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformationInterceptor } from './transform.interceptor';
import { useContainer } from 'class-validator';
import configuration from 'config/configuration';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );
  app.use(helmet());
  app.useGlobalInterceptors(new TransformationInterceptor());

  const config = new DocumentBuilder()
    .setTitle('API Shape Up Indonesia')
    .setDescription('Halo')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory, {
    jsonDocumentUrl: 'docs/json',
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(configuration().port);
}
bootstrap();
