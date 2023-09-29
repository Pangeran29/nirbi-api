import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule, 
    { bufferLogs: true }
  );
  
  // set default logger using pino
  app.useLogger(app.get(Logger))
  
  // get configuration file 
  const configService = app.get(ConfigService)

  await app.listen(configService.get('PORT'));
  
  console.log(await app.getUrl())
}
bootstrap();
