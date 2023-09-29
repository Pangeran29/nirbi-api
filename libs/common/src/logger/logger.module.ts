import pino from 'pino';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        // logs rotation
        const today = new Date();
        const date = today.getUTCDate();
        const month = today.getUTCMonth();
        const year = today.getUTCFullYear();
        const logName = `${date}-${month}-${year}`;

        return {
          pinoHttp: {
            level: 'info',
            transport: {
              target: 'pino-pretty',
              options: {
                singleLine: true,
              },
            },
            stream: pino.destination({
              dest: `./logs/${logName}`, // omit for stdout,
              mkdir: true,
              minLength: 16383, // Buffer before writing
              sync: false, // Asynchronous logging
            }),
          },
        };
      },
    }),
  ],
})
export class LoggerModule {}
