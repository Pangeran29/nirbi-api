import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerBuildFactory } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // enable cors
  app.enableCors();

  // set default logger using pino
  const logger = new Logger('NestApplication');

  // get configuration file
  const configService = app.get(ConfigService);

  // set global validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // build swagger
  SwaggerBuildFactory(app);

  await app.listen(configService.getOrThrow('PORT'), async () => {
    const prefix = configService.getOrThrow('PREFIX_NAME');
    logger.warn(`Swagger is running on: ${await app.getUrl()}/${prefix}/docs`);
    logger.warn(`Application is running on: ${await app.getUrl()}`);
  });
}
bootstrap();
