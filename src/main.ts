import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerBuildFactory } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    { bufferLogs: true }
  )

  // set default logger using pino
  app.useLogger(app.get(Logger))
  const logger = app.get(Logger)

  // get configuration file 
  const configService = app.get(ConfigService)

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
    const prefix = configService.getOrThrow('PREFIX_NAME')
    logger.error(`Swagger is running on: ${await app.getUrl()}/${prefix}/docs`);
    logger.error(`Application is running on: ${await app.getUrl()}`);
  });
}
bootstrap();
