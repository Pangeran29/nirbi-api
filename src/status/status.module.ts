import { Module } from '@nestjs/common';
import { StatusService } from './status.service';
import { StatusController } from './status.controller';
import { FileSystemModule } from '@app/helper';
import { StatusRepository } from './status.repository';

@Module({
  controllers: [StatusController],
  providers: [StatusService, StatusRepository],
  imports: [FileSystemModule],
})
export class StatusModule {}
