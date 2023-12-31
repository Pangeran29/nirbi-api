import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerBuildFactory } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.enableCors();
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

  SwaggerBuildFactory(app);

  const logger = new Logger('NestApplication');
  const configService = app.get(ConfigService);
  await app.listen(configService.getOrThrow('PORT'), async () => {
    const prefix = configService.getOrThrow('PREFIX_NAME');
    logger.warn(`Swagger is running on: ${await app.getUrl()}/${prefix}/docs`);
    logger.warn(`Application (HTTP) is running on: ${await app.getUrl()}`);
    logger.warn(`Application (WS) is running on: ${await app.getUrl()}/chat`);
  });
}
bootstrap();
